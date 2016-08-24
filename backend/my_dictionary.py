from falcon import before, after
from sqlalchemy import Float, select, and_, cast
from sqlalchemy.sql import func

from utils import Handler, json_response, json_request, make_handlers
from auth import require_user
from models import phrase, user_phrase


def phrase_view(time_format):
    def phrase_view_(row):
        completion_time = row.completion_time
        if completion_time is not None:
            completion_time = completion_time.strftime(time_format)
        return {
            'id': row.id,
            'sourceText': row.source_text,
            'targetText': row.target_text,
            'completionTime': completion_time,
            'repeats': row.repeats,
            'progress': row.progress
        }
    return phrase_view_


def select_expression(user_id):
    p = phrase.c
    upc = user_phrase.c

    columns = [
        p.id, p.source_text, p.target_text,
        upc.completion_time, upc.repeats, upc.progress
    ]
    joined = user_phrase.join(phrase, upc.phrase_id == p.id)
    sel = (
        select(columns).select_from(joined).
        where(upc.user_id == user_id).
        order_by(
            upc.completion_time.asc().nullsfirst(),
            (cast(upc.progress, Float) / upc.repeats).asc()
        )
    )
    return sel


@before(require_user)
class ListHandler(Handler):

    @after(json_response)
    def on_get(self, req, resp):
        sel = select_expression(req.context['user'].id)
        rows = self.db.execute(sel).fetchall()
        dt_format = self.app_context.config['my-dictionary']['datetime-format']
        resp.body = list(map(phrase_view(dt_format), rows))


@before(require_user)
class PhraseHandler(Handler):

    @before(json_request)
    def on_post(self, req, resp):
        repeats = self.app_context.config['my-dictionary']['default-repeats']
        user_id = req.context['user'].id
        phrase_id = req.context['body']['id']
        ins = user_phrase.insert().values(
            user_id=user_id,
            phrase_id=phrase_id,
            repeats=repeats,
        )
        self.db.execute(ins)

    @before(json_request)
    def on_patch(self, req, resp, phrase_id):
        user_id = req.context['user'].id
        body = req.context['body']
        upd = (
            user_phrase.update().
            where(and_(
                user_phrase.c.user_id == user_id,
                user_phrase.c.phrase_id == phrase_id
            ))
        )
        if "progress" in body:
            upd = upd.values(progress=body['progress'])
        if "repeats" in body:
            upd = upd.values(repeats=body['repeats'])
        self.db.execute(upd)

    def on_delete(self, req, resp, phrase_id):
        user_id = req.context['user'].id
        delete = (
            user_phrase.delete().
            where(and_(
                user_phrase.c.user_id == user_id,
                user_phrase.c.phrase_id == phrase_id
            ))
        )
        self.db.execute(delete)




configure_handlers = make_handlers("/my-dictionary/", [
    ("list", ListHandler),
    ("phrase/{phrase_id}", PhraseHandler),
    ("add-phrase", PhraseHandler)
])
