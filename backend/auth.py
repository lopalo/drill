from __future__ import annotations
from typing import Optional

import bcrypt  # type: ignore

from falcon import Request, Response
from falcon.errors import HTTPForbidden, HTTPUnauthorized
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError

from common import AppContext
from user import User, UserClientView, sid_key
from models import user_model
from utils import Handler, json_handler, make_handlers


# TODO: user's account activation via e-mail confirmation

class AuthMiddleware:
    def __init__(self, app_context: AppContext):
        self.app_context = app_context

    def process_request(self, req: Request, resp: Response) -> None:
        req.context["user"] = None
        config = self.app_context.config.session
        duration = config.duration_seconds
        sid = req.cookies.get("session_id")
        if sid is None:
            return
        redis = self.app_context.redis
        skey = sid_key(sid)
        data = redis.get(skey)
        redis.expire(skey, duration)
        if data is None:
            return
        req.context["user"] = User.from_json(data, sid)
        resp.set_cookie(
            "session_id",
            sid,
            max_age=duration,
            path="/",
            http_only=False,
            secure=config.secure,
        )


def get_user(req: Request) -> User:
    user = req.context["user"]
    if req.context["user"] is None:
        raise HTTPUnauthorized("Authentication Required", "", [])
    assert isinstance(user, User)
    return user


def get_admin(req: Request) -> User:
    user = get_user(req)
    if not user.record.is_admin:
        raise HTTPForbidden("Permission Denied", "User must be an admin")
    return user


class UserHandler(Handler):
    @json_handler
    def on_get(self, req: Request, resp: Response, *, payload: None) -> UserClientView:
        return get_user(req).client_view


class LoginInput(BaseModel):
    email: str
    password: str


class LoginOutput(BaseModel):
    user: Optional[UserClientView]
    error: Optional[str]


class LoginHandler(Handler):
    @json_handler
    def on_post(
        self, req: Request, resp: Response, *, payload: LoginInput
    ) -> LoginOutput:
        error_output = LoginOutput(error="Wrong email or password")

        sel = user_model.select().where(user_model.c.email == payload.email)
        with self.db.begin() as conn:
            user_record = conn.execute(sel).fetchone()
        if user_record is None:
            return error_output

        usr = User(user_record.items())
        password = payload.password.encode("utf-8")
        user_password = usr.record.password.encode("utf-8")
        if bcrypt.hashpw(password, user_password) != user_password:
            return error_output
        usr.init_profile(self.app_context)
        usr.create_session(self.app_context, resp)
        return LoginOutput(user=usr.client_view)


class LogoutHandler(Handler):
    def on_post(self, req: Request, resp: Response) -> None:
        get_user(req).delete_session(self.app_context, resp)


class RegisterInput(BaseModel):
    name: str
    email: str
    password: str


class RegisterOutput(BaseModel):
    user: Optional[UserClientView]
    error: Optional[str]


class RegisterHandler(Handler):
    @json_handler
    def on_post(
        self, req: Request, resp: Response, *, payload: RegisterInput
    ) -> RegisterOutput:

        password = payload.password.encode("utf-8")
        values = dict(
            name=payload.name,
            email=payload.email,
            password=bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8"),
        )
        ins = user_model.insert().values(**values).returning(*user_model.c)
        with self.db.begin() as conn:
            try:
                user_record = conn.execute(ins).fetchone()
            except IntegrityError:
                return RegisterOutput(error="E-mail is already used")
        usr = User(user_record.items())
        usr.init_profile(self.app_context)
        usr.create_session(self.app_context, resp)
        return RegisterOutput(user=usr.client_view)


configure_handlers = make_handlers(
    "/auth/",
    [
        ("user", UserHandler),
        ("login", LoginHandler),
        ("logout", LogoutHandler),
        ("register", RegisterHandler),
    ],
)
