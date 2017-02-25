import json
import re

import falcon


def kebab_to_camel_case(string):
    parts = string.split("-")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def camel_to_kebab_case(string):
    s = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', string)
    return re.sub('([a-z0-9])([A-Z])', r'\1-\2', s).lower()


def json_request(req, resp, resource, params):
    req.context['body'] = None
    if req.content_length in (None, 0):
        return
    if req.method in ("POST", "PUT"):
        if "application/json" not in req.content_type:
            raise falcon.HTTPUnsupportedMediaType(
                "This API only supports requests encoded as JSON.")
    body = req.stream.read()
    if not body:
        raise falcon.HTTPBadRequest(
            "Empty request body", "A valid JSON document is required.")

    try:
        req.context['body'] = json.loads(body.decode('utf-8'))
    except (ValueError, UnicodeDecodeError):
        raise falcon.HTTPError(
            falcon.HTTP_753,
            "Malformed JSON",
            "Could not decode the request body. The "
            "JSON was incorrect or not encoded as "
            "UTF-8.")


def json_response(req, resp, resource):
    if not req.client_accepts_json:
        raise falcon.HTTPNotAcceptable(
            "This API only supports responses encoded as JSON.")
    resp.body = json.dumps(resp.body)


def make_handlers(prefix, handlers):
    def configure(app, app_context):
        for (sub_route, handler) in handlers:
            app.add_route(prefix + sub_route, handler(app_context))
    return configure


class Handler:

    def __init__(self, app_context):
        self.app_context = app_context

    @property
    def db(self):
        return self.app_context.db_engine
