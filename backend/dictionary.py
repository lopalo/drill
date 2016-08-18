import falcon
from sqlalchemy import desc

from utils import Handler, json_response, json_request, make_handlers
from auth import require_user, require_admin
from models import phrase


def phrase_view(fields):
    return {
        'id': fields['id'],
        'sourceText': fields['source_text'],
        'targetText': fields['target_text'],
        'sourceLang': fields['source_lang'],
        'targetLang': fields['target_lang'],
    }


class ListHandler(Handler):

    @falcon.after(json_response)
    def on_get(self, req, resp):
        sel = phrase.select().order_by(desc(phrase.c.id))
        rows = self.db.execute(sel).fetchall()
        resp.body = list(map(phrase_view, rows))


@falcon.before(require_user)
@falcon.before(require_admin)
class PhraseHandler(Handler):
    @falcon.after(json_response)
    def on_get(self, req, resp, phrase_id):
        sel = phrase.select().where(phrase.c.id == phrase_id)
        resp.body = phrase_view(self.db.execute(sel).fetchone())

    @falcon.before(json_request)
    def on_post(self, req, resp):
        ins = phrase.insert().values(**self._to_db_row(req.context['body']))
        self.db.execute(ins)

    @falcon.before(json_request)
    def on_put(self, req, resp, phrase_id):
        upd = phrase.update().where(phrase.c.id == phrase_id).\
              values(**self._to_db_row(req.context['body']))
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
    ("create-phrase", PhraseHandler)
])
