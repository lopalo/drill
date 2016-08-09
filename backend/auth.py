import os
import base64
import json

import falcon
import bcrypt

from sqlalchemy.exc import IntegrityError

from models import users
from utils import Handler, json_request, json_response, make_handlers


class User:

    def __init__(self, fields, session_id=None):
        fields = dict(fields)
        self._fields = fields
        self._session_id = session_id
        self.__dict__.update(fields)

    @property
    def client_view(self):
        fields = self._fields
        return {
            'name': fields['name'],
            'email': fields['name']
        }

    @property
    def as_json(self):
        return json.dumps(self._fields).encode("utf-8")

    @classmethod
    def from_json(cls, data, session_id=None):
        return cls(json.loads(data.decode("utf-8")), session_id)

    def create_session(self, app_context, resp):
        sid = self._create_session_id()
        config = app_context.config['session']
        duration = config['duration-seconds']
        self._session_id = sid
        resp.set_cookie(
            "session_id", sid,
            max_age=duration,
            path="/",
            secure=config['secure'])
        app_context.redis.set(sid, self.as_json, ex=duration)

    def delete_session(self, app_context, resp):
        resp.unset_cookie("session_id")
        app_context.redis.delete(self._session_id)

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
        data, _ = pipe.get(sid).expire(sid, duration).execute()
        if data is None:
            return
        req.context['user'] = User.from_json(data, sid)
        resp.set_cookie(
            "session_id", sid,
            max_age=duration,
            path="/",
            secure=config['secure'])


def require_user(req, resp, resource, params):
    if req.context["user"] is None:
        raise falcon.HTTPUnauthorized("Authentication Required", "", [])


def require_admin(req, resp, resource, params):
    require_user(req, resp, resource, params)
    if not req.context["user"].is_admin:
        raise falcon.HTTPForbidden(
            "Permission Denied", "User must be an admin")



class UserHandler(Handler):

    @falcon.before(require_user)
    @falcon.after(json_response)
    def on_get(self, req, resp):
        resp.body = req.context['user'].client_view


class LoginHandler(Handler):

    @falcon.before(json_request)
    @falcon.after(json_response)
    def on_post(self, req, resp):
        #TODO: validate args
        body = req.context['body']
        result = resp.body = {'error': None, 'user': None}
        error = "Wrong email or password"

        sel = users.select().where(users.c.email == body['email'])
        with self.db_engine.begin() as conn:
            user_record = conn.execute(sel).fetchone()
        if user_record is None:
            result['error'] = error
            return

        user = User(user_record.items())
        password = body['password'].encode("utf-8")
        user_password = user.password.encode("utf-8")
        if bcrypt.hashpw(password, user_password) != user_password:
            result['error'] = error
            return
        user.create_session(self.app_context, resp)
        result['user'] = user.client_view


class LogoutHandler(Handler):

    @falcon.before(require_user)
    def on_post(self, req, resp):
        req.context['user'].delete_session(self.app_context, req)


class RegisterHandler(Handler):

    @falcon.before(json_request)
    @falcon.after(json_response)
    def on_post(self, req, resp):
        #TODO: validate args
        body = req.context['body']
        result = resp.body = {'error': None, 'user': None}

        password = body['password'].encode("utf-8")
        values = dict(
            name=body['name'],
            email=body['email'],
            password=bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")
        )
        ins = users.insert().values(**values).returning(*users.c)
        with self.db_engine.begin() as conn:
            try:
                user_record = conn.execute(ins).fetchone()
            except IntegrityError:
                result['error'] = "E-mail is already used"
                return
        user = User(user_record.items())
        user.create_session(self.app_context, resp)
        result['user'] = user.client_view


configure_handlers = make_handlers("/auth/", [
    ("user", UserHandler),
    ("login", LoginHandler),
    ("logout", LogoutHandler),
    ("register", RegisterHandler)
])