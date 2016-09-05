from falcon import before, after
from sqlalchemy import select, exists, and_, or_
from sqlalchemy.sql import func
from guess_language import guess_language

from utils import Handler, json_response, json_request, make_handlers
from auth import require_user, require_admin
from models import (
    phrase, user_phrase, user,
    grammar_section_phrase as gs_phrase,
    theme_phrase
)
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
    res['grammarSections'] = row.grammar_sections
    res['themes'] = row.themes
    return res


@before(require_user)
class ListHandler(Handler):

    @after(json_response)
    def on_get(self, req, resp):
        params = req.params
        user_id = req.context['user'].id
        conditions = []
        pc = phrase.c
        is_in_my_dict = (
            exists().
            where(and_(
                user_phrase.c.user_id == user_id,
                user_phrase.c.phrase_id == pc.id
            )).
            label("is_in_my_dict")
        )
        joined = phrase.join(
            user,
            pc.added_by_user_id == user.c.id,
            isouter=True
        )
        if "grammar-section" in params:
            joined = joined.join(
                gs_phrase,
                pc.id == gs_phrase.c.phrase_id
            )
            conditions.append(
                gs_phrase.c.section_id == params['grammar-section']
            )
        if "theme" in params:
            joined = joined.join(
                theme_phrase,
                pc.id == theme_phrase.c.phrase_id
            )
            conditions.append(theme_phrase.c.theme_id == params['theme'])

        if "target-language" in params:
            conditions.append(pc.target_lang == params['target-language'])
        if params.get("text"):
            #TODO: full text search
            pattern = "%{}%".format(params['text'])
            conditions.append(or_(
                pc.source_text.ilike(pattern),
                pc.target_text.ilike(pattern),
            ))

        columns = []
        columns.extend(pc)
        columns.extend([
            is_in_my_dict,
            user.c.name.label("added_by")
        ])
        sel = (
            select(columns).
            distinct(pc.id).
            select_from(joined).
            order_by(pc.id.desc())
        )
        if conditions:
            sel = sel.where(and_(*conditions))
        rows = self.db.execute(sel).fetchall()
        resp.body = list(map(phrase_list_view, rows))


@before(require_admin)
class PhraseHandler(Handler):
    @after(json_response)
    def on_get(self, req, resp, phrase_id):
        columns = []
        columns.extend(phrase.c)
        columns.append(
            func.coalesce(
                select([func.array_agg(gs_phrase.c.section_id)]).
                where(gs_phrase.c.phrase_id == phrase_id).
                as_scalar(),
                []
            ).
            label("grammar_sections")
        )
        columns.append(
            func.coalesce(
                select([func.array_agg(theme_phrase.c.theme_id)]).
                where(theme_phrase.c.phrase_id == phrase_id).
                as_scalar(),
                []
            ).
            label("themes")
        )
        sel = select(columns).where(phrase.c.id == phrase_id)
        resp.body = phrase_editor_view(self.db.execute(sel).fetchone())

    @before(json_request)
    def on_post(self, req, resp):
        body = req.context['body']
        row = self._to_db_row(body)
        row['added_by_user_id'] = req.context['user'].id
        phrase_ins = phrase.insert().values(**row).returning(phrase.c.id)
        phrase_id = self.db.execute(phrase_ins).fetchone().id
        themes_ins = theme_phrase.insert().values([
            {'theme_id': theme_id, 'phrase_id': phrase_id}
            for theme_id in body['themes']])
        sections_ins = gs_phrase.insert().values([
            {'section_id': theme_id, 'phrase_id': phrase_id}
            for theme_id in body['grammarSections']])
        with self.db.begin() as conn:
            conn.execute(themes_ins);
            conn.execute(sections_ins);

    @before(json_request)
    def on_put(self, req, resp, phrase_id):
        body = req.context['body']
        phrase_upd = (
            phrase.update().
            where(phrase.c.id == phrase_id).
            values(**self._to_db_row(body))
        )
        themes_del = (
            theme_phrase.delete().
            where(theme_phrase.c.phrase_id == phrase_id)
        )
        sections_del = (
            gs_phrase.delete().
            where(gs_phrase.c.phrase_id == phrase_id)
        )
        themes_ins = theme_phrase.insert().values([
            {'theme_id': theme_id, 'phrase_id': phrase_id}
            for theme_id in body['themes']])
        sections_ins = gs_phrase.insert().values([
            {'section_id': theme_id, 'phrase_id': phrase_id}
            for theme_id in body['grammarSections']])
        with self.db.begin() as conn:
            conn.execute(phrase_upd);
            conn.execute(themes_del)
            conn.execute(sections_del)
            if body['themes']:
                conn.execute(themes_ins);
            if body['grammarSections']:
                conn.execute(sections_ins);


    def on_delete(self, req, resp, phrase_id):
        delete = phrase.delete().where(phrase.c.id == phrase_id)
        self.db.execute(delete)

    @staticmethod
    def _to_db_row(fields):
        source_text = fields['sourceText']
        target_text = fields['targetText']
        return {
            'source_text': source_text,
            'target_text': target_text,
            'source_lang': guess_language(source_text),
            'target_lang': guess_language(target_text),
        }


configure_handlers = make_handlers("/dictionary/", [
    ("list", ListHandler),
    ("phrase/{phrase_id}", PhraseHandler),
    ("create-phrase", PhraseHandler),

    ("grammar-sections", GrammarSectionsHandler),
    ("themes", ThemesHandler),
])
