from falcon import before, after
from sqlalchemy import select, exists, and_

from utils import Handler, json_response, json_request, make_handlers
from auth import require_user, require_admin
from models import phrase, user_phrase


def phrase_view(row):
    return {
        'id': row.id,
        'sourceText': row.source_text,
        'targetText': row.target_text,
        'sourceLang': row.source_lang,
        'targetLang': row.target_lang,
    }


def phrase_list_view(row):
    res = phrase_view(row)
    res['isAdded'] = row.is_added
    return res


@before(require_user)
class ListHandler(Handler):

    @after(json_response)
    def on_get(self, req, resp):
        user_id = req.context['user'].id
        is_added = (
            exists().
            where(and_(
                user_phrase.c.user_id == user_id,
                user_phrase.c.phrase_id == phrase.c.id
            )).
            label("is_added")
        )
        sel = select(phrase.c + [is_added]).order_by(phrase.c.id.desc())
        rows = self.db.execute(sel).fetchall()
        resp.body = list(map(phrase_list_view, rows))


@before(require_admin)
class PhraseHandler(Handler):
    @after(json_response)
    def on_get(self, req, resp, phrase_id):
        sel = phrase.select().where(phrase.c.id == phrase_id)
        resp.body = phrase_view(self.db.execute(sel).fetchone())

    @before(json_request)
    def on_post(self, req, resp):
        ins = phrase.insert().values(**self._to_db_row(req.context['body']))
        self.db.execute(ins)

    @before(json_request)
    def on_put(self, req, resp, phrase_id):
        upd = (
            phrase.update().
            where(phrase.c.id == phrase_id).
            values(**self._to_db_row(req.context['body']))
        )
        self.db.execute(upd)

    def on_delete(self, req, resp, phrase_id):
        delete = phrase.delete().where(phrase.c.id == phrase_id)
        self.db.execute(delete)

    @staticmethod
    def _to_db_row(fields):
       return {
           'source_text': fields['sourceText'],
           'target_text': fields['targetText'],
           'source_lang': fields['sourceLang'],
           'target_lang': fields['targetLang'],
       }


configure_handlers = make_handlers("/dictionary/", [
    ("list", ListHandler),
    ("phrase/{phrase_id}", PhraseHandler),
    ("create-phrase", PhraseHandler),
])
