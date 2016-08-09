import yaml
import falcon

from utils import Handler, json_response, make_handlers


class WorkingSetHandler(Handler):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        #TODO: delete
        with open("test_phrases.yaml") as f:
            self.test_phrases = yaml.load(f)

    @falcon.after(json_response)
    def on_get(self, req, resp):
        resp.body = self.test_phrases


configure_handlers = make_handlers("/training/", [
    ("working-set", WorkingSetHandler)
])
