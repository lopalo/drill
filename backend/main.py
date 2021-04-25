from __future__ import annotations
import sys
from typing import Optional

import yaml
from falcon.api import API
import sqlalchemy
from falcon_cors import CORS  # type: ignore
from redis import StrictRedis


from common import AppContext, Config
from auth import AuthMiddleware, configure_handlers as configure_auth
from training import configure_handlers as configure_training
from dictionary import configure_handlers as configure_dictionary
from my_dictionary import configure_handlers as configure_my_dictionary
from profile import configure_handlers as configure_profile


def configure_app(config_path: Optional[str] = None) -> API:
    config = get_config(config_path)
    db_engine = sqlalchemy.create_engine(
        config.db.url, client_encoding="utf8", echo=config.db.echo
    )
    redis = StrictRedis(
        host=config.redis.host,
        port=config.redis.port,
        db=config.redis.db,
        encoding="utf-8",
    )
    app_context = AppContext(config, db_engine, redis)
    cors = CORS(
        allow_all_origins=True,
        allow_all_methods=True,
        allow_all_headers=True,
        allow_credentials_all_origins=True,
    )
    app = API(middleware=[cors.middleware, AuthMiddleware(app_context)])
    configure_auth(app, app_context)
    configure_training(app, app_context)
    configure_dictionary(app, app_context)
    configure_my_dictionary(app, app_context)
    configure_profile(app, app_context)
    return app


def get_config(path: Optional[str] = None) -> Config:
    if path is None:
        path = sys.argv[1]
    with open(path) as f:
        return Config.parse_obj(yaml.load(f))
