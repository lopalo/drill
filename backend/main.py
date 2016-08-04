import yaml
import falcon

from utils import json_response


class Profile:

    @falcon.after(json_response)
    def on_get(self, req, resp):
        resp.body = {'userName': "Test User"}


class TrainingSet:

    def __init__(self, test_phrases):
        self.test_phrases = test_phrases

    @falcon.after(json_response)
    def on_get(self, req, resp):
        resp.body = self.test_phrases
        return


def build_app():
    app = falcon.API()
    with open("../db/test_phrases.yaml") as f:
        test_phrases = yaml.load(f)
    app.add_route("/profile", Profile())
    app.add_route("/training-set", TrainingSet(test_phrases))
    return app
