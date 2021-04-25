from __future__ import annotations
from typing import NamedTuple, Union, Literal
from pydantic import BaseModel
from sqlalchemy.engine.base import Engine
from redis import StrictRedis


TrainingType = Union[Literal["typing"], Literal["typing"]]
SpeakLanguage = Union[Literal["en"], Literal["ru"]]


# TODO: more precise validation
class DB(BaseModel):
    url: str
    echo: bool


class Redis(BaseModel):
    host: str
    port: int
    db: int


class Session(BaseModel):
    duration_seconds: int
    secure: bool


class Dictionary(BaseModel):
    limit: int


class MyDictionary(BaseModel):
    datetime_format: str


class Profile(BaseModel):
    training_type: TrainingType
    auto_speak: bool
    speak_language: SpeakLanguage

    working_set_size: int
    repeats: int
    completed_repeat_factor: float


class Config(BaseModel):
    db: DB
    redis: Redis
    session: Session
    dictionary: Dictionary
    my_dictionary: MyDictionary
    default_profile: Profile


class AppContext(NamedTuple):
    config: Config
    db_engine: Engine
    redis: StrictRedis[str]
