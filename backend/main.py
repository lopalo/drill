import sys
from collections import namedtuple

import yaml
import falcon
import sqlalchemy
from falcon_cors import CORS
from redis import StrictRedis


from auth import AuthMiddleware, configure_handlers as configure_auth
from training import configure_handlers as configure_training
from dictionary import configure_handlers as configure_dictionary
from my_dictionary import configure_handlers as configure_my_dictionary
from profile import configure_handlers as configure_profile

AppContext = namedtuple("AppContext", ["config", "db_engine", "redis"])


def configure_app(config_path=None):
    config = get_config(config_path)
    db_engine = sqlalchemy.create_engine(
        config['db']['url'],
        client_encoding="utf8",
        echo=config['db']['echo'])
    redis = StrictRedis(**config['redis'])
    app_context = AppContext(config, db_engine, redis)
    cors = CORS(allow_all_origins=True,
                allow_all_methods=True,
                allow_all_headers=True,
                allow_credentials_all_origins=True)
    app = falcon.API(middleware=[
        cors.middleware,
        AuthMiddleware(app_context)
    ])
    configure_auth(app, app_context)
    configure_training(app, app_context)
    configure_dictionary(app, app_context)
    configure_my_dictionary(app, app_context)
    configure_profile(app, app_context)
    return app


def get_config(path=None):
    if path is None:
        path = sys.argv[1]
    with open(path) as f:
        return yaml.load(f)
