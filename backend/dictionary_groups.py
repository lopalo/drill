import json

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


class GroupHandler(Handler):

    @property
    def key(self):
        raise NotImplementedError

    def invalidate_cache(self):
        self.app_context.redis.delete(self.key)

    def on_get(self, req, resp):
        redis = self.app_context.redis
        data = redis.get(self.key)
        if data is not None:
            resp.body = json.loads(data.decode("utf-8"))
            return
        groups = self._get()
        redis.set(self.key, json.dumps(groups).encode("utf-8"))
        resp.body = groups

    def _get(self):
        raise NotImplementedError


@after(json_response)
class GrammarSectionsHandler(GroupHandler):

    key = "grammar_sections"

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

    @before(require_admin)
    @before(json_request)
    def on_post(self, req, resp):
        body = req.context['body']
        action = body['action']
        if action == "create":
            expr = grammar_section.insert().values(title=body['title'].strip())
        elif action == "delete":
            expr = (
                grammar_section.delete().
                where(grammar_section.c.id == body['id'])
            )
        else:
            return
        try:
            self.db.execute(expr)
            self.invalidate_cache()
        except IntegrityError:
            pass
        resp.body = self._get()


@after(json_response)
class ThemesHandler(GroupHandler):

    key = "themes"

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

    @before(require_admin)
    @before(json_request)
    def on_post(self, req, resp):
        body = req.context['body']
        action = body['action']
        if action == "create":
            expr = theme.insert().values(title=body['title'].strip())
        elif action == "delete":
            expr = theme.delete().where(theme.c.id == body['id'])
        else:
            return
        try:
            self.db.execute(expr)
            self.invalidate_cache()
        except IntegrityError:
            pass
        resp.body = self._get()




