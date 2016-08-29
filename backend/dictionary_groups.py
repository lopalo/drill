from falcon import before, after
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError

from utils import Handler, json_response, json_request
from auth import require_admin
from models import grammar_section, grammar_section_phrase, theme, theme_phrase


def item_view(row):
    return {
        'id': row.id,
        'title': row.title,
        'phraseAmount': row.phrase_amount
    }


@after(json_response)
class GrammarSectionsHandler(Handler):

    def _get(self):
        gsc = grammar_section.c
        gspc = grammar_section_phrase.c
        phrase_amount = (
            select([gspc.section_id, func.count().label("amount")]).
            group_by(gspc.section_id).
            cte("phrase_amount")
        )
        joined = grammar_section.join(
            phrase_amount,
            gsc.id == phrase_amount.c.section_id,
            isouter=True
        )
        sel = (
            select([
                gsc.id,
                gsc.title,
                func.coalesce(phrase_amount.c.amount, 0).label("phrase_amount")
            ]).
            select_from(joined).
            order_by(gsc.title.asc())
        )
        return {r.id: item_view(r) for r in self.db.execute(sel).fetchall()}

    def on_get(self, req, resp):
        resp.body = self._get()

    @before(require_admin)
    @before(json_request)
    def on_post(self, req, resp):
        body = req.context['body']
        action = body['action']
        if action == "create":
            expr = grammar_section.insert().values(title=body['title'])
        elif action == "delete":
            expr = (
                grammar_section.delete().
                where(grammar_section.c.id == body['id'])
            )
        else:
            return
        try:
            self.db.execute(expr)
        except IntegrityError:
            pass
        resp.body = self._get()


@after(json_response)
class ThemesHandler(Handler):

    def _get(self):
        tc = theme.c
        tpc = theme_phrase.c
        phrase_amount = (
            select([tpc.theme_id, func.count().label("amount")]).
            group_by(tpc.theme_id).
            cte("phrase_amount")
        )
        joined = theme.join(
            phrase_amount,
            tc.id == phrase_amount.c.theme_id,
            isouter=True
        )
        sel = (
            select([
                tc.id,
                tc.title,
                func.coalesce(phrase_amount.c.amount, 0).label("phrase_amount")
            ]).
            select_from(joined).
            order_by(tc.title.asc())
        )
        return {r.id: item_view(r) for r in self.db.execute(sel).fetchall()}

    def on_get(self, req, resp):
        resp.body = self._get()

    @before(require_admin)
    @before(json_request)
    def on_post(self, req, resp):
        body = req.context['body']
        action = body['action']
        if action == "create":
            expr = theme.insert().values(title=body['title'])
        elif action == "delete":
            expr = theme.delete().where(theme.c.id == body['id'])
        else:
            return
        try:
            self.db.execute(expr)
        except IntegrityError:
            pass
        resp.body = self._get()




