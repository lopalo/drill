import yaml
import falcon

from utils import Handler, json_response, make_handlers
from auth import require_user


@falcon.before(require_user)
class WorkingSetHandler(Handler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        #TODO: delete
        with open("test_phrases.yaml") as f:
            self.test_phrases = yaml.load(f)

    @falcon.after(json_response)
    def on_get(self, req, resp):
        resp.body = self.test_phrases


@falcon.before(require_user)
class IncrementProgressHanlder(Handler):

    def on_post(self, req, resp, phrase_id):
        #TODO: try-except IntegrityError
        #  .values(progress=user_phrase.c.progress + 1)
        pass

configure_handlers = make_handlers("/training/", [
    ("working-set", WorkingSetHandler)
])
