import os
import base64
import json

import bcrypt

from falcon import before, after, HTTPUnauthorized, HTTPForbidden
from sqlalchemy.exc import IntegrityError

from models import user
from utils import (
    Handler, json_request, json_response,
    make_handlers, kebab_to_camel_case
)


def sid_key(sid):
    return "session_id:" + sid

#TODO: user's account activation via e-mail confirmation
#TODO: validate request arguments

class User:

    def __init__(self, fields, session_id=None):
        fields = dict(fields)
        self._fields = fields
        self._session_id = session_id

    def __getattr__(self, name):
        if name not in self._fields:
            raise AttributeError
        return self._fields[name]

    @property
    def client_view(self):
        fields = self._fields
        return {
            'name': fields['name'],
            'email': fields['email'],
            'isAdmin': fields['is_admin'],
            'profile': {kebab_to_camel_case(k): v for k, v in
                        fields['profile'].items()}
        }

    @property
    def as_json(self):
        return json.dumps(self._fields).encode("utf-8")

    @classmethod
    def from_json(cls, data, session_id=None):
        return cls(json.loads(data.decode("utf-8")), session_id)

    def init_profile(self, app_context):
        for k, v in app_context.config['default-profile'].items():
            if k not in self.profile:
                self.profile[k] = v

    def create_session(self, app_context, resp):
        sid = self._create_session_id()
        config = app_context.config['session']
        duration = config['duration-seconds']
        self._session_id = sid
        resp.set_cookie(
            "session_id", sid,
            max_age=duration,
            path="/",
            http_only=False,
            secure=config['secure'])
        app_context.redis.set(sid_key(sid), self.as_json, ex=duration)

    def update_session(self, app_context):
        config = app_context.config['session']
        duration = config['duration-seconds']
        app_context.redis.set(
            sid_key(self._session_id),
            self.as_json, ex=duration)

    def delete_session(self, app_context, resp):
        resp.unset_cookie("session_id")
        app_context.redis.delete(sid_key(self._session_id))

    @staticmethod
    def _create_session_id():
        return base64.b64encode(os.urandom(20)).decode("ascii")


class AuthMiddleware:

    def __init__(self, app_context):
        self.app_context = app_context

    def process_request(self, req, resp):
        req.context['user'] = None
        config = self.app_context.config['session']
        duration = config['duration-seconds']
        sid = req.cookies.get('session_id')
        if sid is None:
            return
        pipe = self.app_context.redis.pipeline()
        skey = sid_key(sid)
        data, _ = pipe.get(skey).expire(skey, duration).execute()
        if data is None:
            return
        req.context['user'] = User.from_json(data, sid)
        resp.set_cookie(
            "session_id", sid,
            max_age=duration,
            path="/",
            http_only=False,
            secure=config['secure'])


def require_user(req, resp, resource, params):
    if req.context["user"] is None:
        raise HTTPUnauthorized("Authentication Required", "", [])


def require_admin(req, resp, resource, params):
    require_user(req, resp, resource, params)
    if not req.context["user"].is_admin:
        raise HTTPForbidden("Permission Denied", "User must be an admin")


class UserHandler(Handler):

    @before(require_user)
    @after(json_response)
    def on_get(self, req, resp):
        resp.body = req.context['user'].client_view


class LoginHandler(Handler):

    @before(json_request)
    @after(json_response)
    def on_post(self, req, resp):
        body = req.context['body']
        result = resp.body = {'error': None, 'user': None}
        error = "Wrong email or password"

        sel = user.select().where(user.c.email == body['email'])
        with self.db.begin() as conn:
            user_record = conn.execute(sel).fetchone()
        if user_record is None:
            result['error'] = error
            return

        usr = User(user_record.items())
        password = body['password'].encode("utf-8")
        user_password = usr.password.encode("utf-8")
        if bcrypt.hashpw(password, user_password) != user_password:
            result['error'] = error
            return
        usr.init_profile(self.app_context)
        usr.create_session(self.app_context, resp)
        result['user'] = usr.client_view


class LogoutHandler(Handler):

    @before(require_user)
    def on_post(self, req, resp):
        req.context['user'].delete_session(self.app_context, resp)


class RegisterHandler(Handler):

    @before(json_request)
    @after(json_response)
    def on_post(self, req, resp):
        body = req.context['body']
        result = resp.body = {'error': None, 'user': None}

        password = body['password'].encode("utf-8")
        values = dict(
            name=body['name'],
            email=body['email'],
            password=bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")
        )
        ins = user.insert().values(**values).returning(*user.c)
        with self.db.begin() as conn:
            try:
                user_record = conn.execute(ins).fetchone()
            except IntegrityError:
                result['error'] = "E-mail is already used"
                return
        usr = User(user_record.items())
        usr.init_profile(self.app_context)
        usr.create_session(self.app_context, resp)
        result['user'] = usr.client_view


configure_handlers = make_handlers("/auth/", [
    ("user", UserHandler),
    ("login", LoginHandler),
    ("logout", LogoutHandler),
    ("register", RegisterHandler)
])
