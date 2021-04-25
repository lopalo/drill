from falcon import Request, Response, before

from models import user_model
from utils import (
    Handler, json_request,
    make_handlers, camel_to_kebab_case
)
from auth import get_user


class ProfileHandler(Handler):

    @before(json_request) #type: ignore
    def on_patch(self, req: Request, resp: Response) -> None:
        usr = req.context['user']
        body = req.context['body']
        field_name = camel_to_kebab_case(body['fieldName'])
        value = body['value']
        assert field_name in usr.profile, field_name
        usr.profile[field_name] = value
        upd = (
            user_model.update().
            where(user_model.c.id == usr.id).
            values(profile=usr.profile)
        )
        self.db.execute(upd)
        usr.update_session(self.app_context)


configure_handlers = make_handlers("/", [
    ("profile", ProfileHandler),
])
