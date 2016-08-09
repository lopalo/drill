import sys
from collections import namedtuple

import yaml
import falcon
import sqlalchemy
from redis import StrictRedis


from auth import AuthMiddleware, configure_handlers as configure_auth
from training import configure_handlers as configure_training

AppContext = namedtuple("AppContext", ["config", "db_engine", "redis"])


def configure_app(config_path=None):
    config = get_config(config_path)
    db_engine = sqlalchemy.create_engine(
        config['db']['url'],
        client_encoding="utf8")
    redis = StrictRedis(**config['redis'])
    app_context = AppContext(config, db_engine, redis)
    app = falcon.API(middleware=[AuthMiddleware(app_context)])
    configure_auth(app, app_context)
    configure_training(app, app_context)
    return app


def get_config(path=None):
    if path is None:
        path = sys.argv[1]
    with open(path) as f:
        return yaml.load(f)
