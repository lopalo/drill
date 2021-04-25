from __future__ import annotations
import json
import os
import base64

from typing import Optional
from pydantic import BaseModel
from falcon import Response

from common import AppContext, Profile, TrainingType, SpeakLanguage
from utils import kebab_to_camel_case


class UserRecord(BaseModel):
    name: str
    email: str
    password: str
    is_admin: str
    profile: Profile


class ProfileView(BaseModel):
    trainingtype: TrainingType
    autoSpeak: bool
    speakLanguage: SpeakLanguage

    workingSetSize: int
    repeats: int
    completedRepeatFactor: float


class UserClientView(BaseModel):
    name: str
    email: str
    isAdmin: str
    profile: ProfileView


def sid_key(sid: str) -> str:
    return "session_id:" + sid


class User:
    def __init__(self, record: UserRecord, session_id: Optional[str] = None):
        self.record = record
        self._session_id = session_id

    @property
    def client_view(self) -> UserClientView:
        record = self.record
        return UserClientView(
            name=record.name,
            email=record.email,
            isAdmin=record.is_admin,
            profile=ProfileView.parse_obj(
                {kebab_to_camel_case(k): v for k, v in record.profile.dict().items()}
            ),
        )

    @property
    def as_json(self) -> str:
        return json.dumps(self.record)

    @classmethod
    def from_json(cls, payload: str, session_id: Optional[str] = None) -> User:
        return cls(json.loads(payload), session_id)

    def init_profile(self, app_context: AppContext) -> None:
        profile = app_context.config.default_profile.dict()
        profile.update(self.record.profile.dict())
        self.record.profile = Profile.parse_obj(profile)

    def create_session(self, app_context: AppContext, resp: Response) -> None:
        sid = self._create_session_id()
        config = app_context.config.session
        duration = config.duration_seconds
        self._session_id = sid
        resp.set_cookie(
            "session_id",
            sid,
            max_age=duration,
            path="/",
            http_only=False,
            secure=config.secure,
        )
        app_context.redis.set(sid_key(sid), self.as_json, ex=duration)

    def update_session(self, app_context: AppContext) -> None:
        sid = self._session_id
        if sid is None:
            return
        config = app_context.config.session
        duration = config.duration_seconds
        app_context.redis.set(sid_key(sid), self.as_json, ex=duration)

    def delete_session(self, app_context: AppContext, resp: Response) -> None:
        sid = self._session_id
        if sid is None:
            return
        resp.unset_cookie("session_id")
        app_context.redis.delete(sid_key(sid))

    @staticmethod
    def _create_session_id() -> str:
        return base64.b64encode(os.urandom(20)).decode("ascii")
