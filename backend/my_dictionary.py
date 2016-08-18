import falcon

from utils import Handler, json_response, make_handlers


class ListHandler(Handler):

    @falcon.after(json_response)
    def on_get(self, req, resp):
        resp.body = []


configure_handlers = make_handlers("/my-dictionary/", [
    ("list", ListHandler)
])
