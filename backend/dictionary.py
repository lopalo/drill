from falcon import before, after
from sqlalchemy import select, exists, and_

from utils import Handler, json_response, json_request, make_handlers
from auth import require_user, require_admin
from models import phrase, user_phrase, user
from dictionary_groups import GrammarSectionsHandler, ThemesHandler


def phrase_view(row):
    return {
        'id': row.id,
        'sourceText': row.source_text,
        'targetText': row.target_text,
    }


def phrase_list_view(row):
    res = phrase_view(row)
    res['isInMyDict'] = row.is_in_my_dict
    res['addedBy'] = row.added_by
    return res


def phrase_editor_view(row):
    res = phrase_view(row)
    res['sourceLang'] = row.source_lang
    res['targetLang'] = row.target_lang
    res['grammarSections'] = [] #TODO: row.grammarSections
    res['themes'] = [] #TODO: row.grammarSections
    return res


@before(require_user)
class ListHandler(Handler):

    @after(json_response)
    def on_get(self, req, resp):
        user_id = req.context['user'].id
        is_in_my_dict = (
            exists().
            where(and_(
                user_phrase.c.user_id == user_id,
                user_phrase.c.phrase_id == phrase.c.id
            )).
            label("is_in_my_dict")
        )
        joined = phrase.join(
            user,
            phrase.c.added_by_user_id == user.c.id,
            isouter=True
        )
        columns = []
        columns.extend(phrase.c)
        columns.extend([
            is_in_my_dict,
            user.c.name.label("added_by")
        ])
        sel = select(columns).select_from(joined).order_by(phrase.c.id.desc())
        rows = self.db.execute(sel).fetchall()
        resp.body = list(map(phrase_list_view, rows))


@before(require_admin)
class PhraseHandler(Handler):
    @after(json_response)
    def on_get(self, req, resp, phrase_id):
        sel = phrase.select().where(phrase.c.id == phrase_id)
        resp.body = phrase_editor_view(self.db.execute(sel).fetchone())

    @before(json_request)
    def on_post(self, req, resp):
        row = self._to_db_row(req.context['body'])
        row['added_by_user_id'] = req.context['user'].id
        ins = phrase.insert().values(**row)
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

    ("grammar-sections", GrammarSectionsHandler),
    ("themes", ThemesHandler),
])
