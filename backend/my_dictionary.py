import falcon
from sqlalchemy import Float, select, and_, cast

from utils import Handler, json_response, json_request, make_handlers
from auth import require_user
from models import phrase, user_phrase


def phrase_view(fields):
    return {
        'id': fields.id,
        'sourceText': fields.source_text,
        'targetText': fields.target_text,
        'completionTime': fields.completion_time,
        'repeats': fields.repeats,
        'progress': fields.progress
    }


@falcon.before(require_user)
class ListHandler(Handler):

    @falcon.after(json_response)
    def on_get(self, req, resp):
        user_id = req.context['user'].id
        p = phrase.c
        up = user_phrase.c

        columns = [
            p.id, p.source_text, p.target_text,
            up.completion_time, up.repeats, up.progress
        ]
        joined = user_phrase.join(phrase, up.phrase_id == p.id)
        sel = (
            select(columns).select_from(joined).
            where(up.user_id == user_id).
            order_by(
                up.completion_time.asc().nullsfirst(),
                (cast(up.progress, Float) / up.repeats).asc()
            )
        )
        rows = self.db.execute(sel).fetchall()
        resp.body = list(map(phrase_view, rows))


@falcon.before(require_user)
class PhraseHandler(Handler):

    @falcon.before(json_request)
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

    @falcon.before(json_request)
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
