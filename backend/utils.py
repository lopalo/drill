import json
import re
from typing import (
    Any,
    Optional,
    Type,
    TypeVar,
    Protocol,
    Callable,
    Iterable,
    Tuple,
    get_type_hints,
)

from pydantic import BaseModel, ValidationError
from falcon import errors
from falcon import http_error
from falcon import status_codes

from falcon.api import API
from falcon import Request, Response

from sqlalchemy.engine.base import Engine

from common import AppContext


def kebab_to_camel_case(string: str) -> str:
    parts = string.split("-")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


def camel_to_kebab_case(string: str) -> str:
    s = re.sub("(.)([A-Z][a-z]+)", r"\0-\2", string)
    return re.sub("([a-z0-9])([A-Z])", r"\1-\2", s).lower()


def json_request(
    req: Request, resp: Response, resource: object, params: object
) -> None:
    req.context["body"] = None
    if req.content_length in (None, 0):
        return
    if req.method in ("POST", "PUT"):
        if "application/json" not in req.content_type:
            raise errors.HTTPUnsupportedMediaType(
                "This API only supports requests encoded as JSON."
            )
    body = req.stream.read()
    if not body:
        raise errors.HTTPBadRequest(
            "Empty request body", "A valid JSON document is required."
        )

    try:
        req.context["body"] = json.loads(body.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        raise http_error.HTTPError(
            status_codes.HTTP_753,
            "Malformed JSON",
            "Could not decode the request body. The "
            "JSON was incorrect or not encoded as "
            "UTF-8.",
        )


def json_response(req: Request, resp: Response, resource: object) -> None:
    if not req.client_accepts_json:
        raise errors.HTTPNotAcceptable(
            "This API only supports responses encoded as JSON."
        )
    resp.body = json.dumps(resp.body)


Self = TypeVar("Self", contravariant=True)
Payload = TypeVar("Payload", contravariant=True)
Return = TypeVar("Return", covariant=True)


class JsonHandler(Protocol[Self]):
    def __call__(
        _, self: Self, req: Request, resp: Response, *, payload: Any
    ) -> Optional[BaseModel]:
        ...


WrappedJsonHandler = Callable[[Self, Request, Response], None]


def json_handler(handler: JsonHandler[Self]) -> WrappedJsonHandler[Self]:
    hints = get_type_hints(handler)
    payload_model = hints.get("payload", None)
    parse_input = issubclass(payload_model, BaseModel)

    def wrapped(self: Self, req: Request, resp: Response) -> None:
        payload = None
        if parse_input:
            json_request(req, resp, None, None)
            try:
                payload = payload_model.parse_obj(req.context["body"])
            except ValidationError as error:
                raise errors.HTTPBadRequest("Validation failed", error.json())
        result = handler(self, req, resp, payload=payload)
        if result is None:
            return
        resp.body = result.dict()
        json_response(req, resp, None)

    return wrapped


class Handler:

    app_context: AppContext

    def __init__(self, app_context: AppContext):
        self.app_context = app_context

    @property
    def db(self) -> Engine:
        return self.app_context.db_engine


def make_handlers(
    prefix: str, handlers: Iterable[Tuple[str, Type[Handler]]]
) -> Callable[[API, AppContext], None]:
    def configure(app: API, app_context: AppContext) -> None:
        for (sub_route, handler) in handlers:
            app.add_route(prefix + sub_route, handler(app_context))

    return configure
