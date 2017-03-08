from math import ceil

from falcon import before, after
from sqlalchemy import and_
from sqlalchemy.sql import func as f

from utils import Handler, json_request, json_response, make_handlers
from models import user_phrase
from auth import require_user
from my_dictionary import select_expression, phrase_view


@before(require_user)
class WorkingSetHandler(Handler):


    @property
    def config(self):
        return self.app_context.config['training']

    @staticmethod
    def size(req):
        return int(req.context['user'].profile['working-set-size'])

    def convert_phrase_view(self, i, req):
        i = i.copy()
        isCompleted = (
            i['completionTime'] is not None or i['progress'] == i['repeats']
        )
        i['isCompleted'] = isCompleted
        i.pop('completionTime')
        if not isCompleted or i['progress'] < i['repeats']:
            return i
        i['progress'] = 0
        rfactor = float(req.context['user'].profile['completed-repeat-factor'])
        i['repeats'] = int(ceil(i['repeats'] * rfactor))
        return i

    def make_working_set(self, rows, req):
        dt_format = self.app_context.config['my-dictionary']['datetime-format']
        view = phrase_view(dt_format)
        return [self.convert_phrase_view(view(r), req) for r in rows]

    @after(json_response)
    def on_get(self, req, resp):
        user_id = req.context['user'].id
        sel = select_expression(user_id).limit(self.size(req))
        rows = self.db.execute(sel).fetchall()
        resp.body = self.make_working_set(rows, req)

    @before(json_request)
    @after(json_response)
    def on_post(self, req, resp):
        user_id = req.context['user'].id
        phrase_id = req.context['body']['id']
        upd = (
            user_phrase.update().
            where(and_(
                user_phrase.c.user_id == user_id,
                user_phrase.c.phrase_id == phrase_id
            )).
            values(progress=user_phrase.c.repeats, completion_time=f.now())
        )
        sel = select_expression(user_id).limit(self.size(req))
        with self.db.begin() as conn:
            conn.execute(upd)
            rows = conn.execute(sel).fetchall()
        resp.body = self.make_working_set(rows, req)


@before(require_user)
class IncrementProgressHanlder(Handler):

    @before(json_request)
    def on_post(self, req, resp):
        user_id = req.context['user'].id
        phrase_id = req.context['body']['id']
        progress = req.context['body']['progress']
        upd = (
            user_phrase.update().
            where(and_(
                user_phrase.c.user_id == user_id,
                user_phrase.c.phrase_id == phrase_id
            )).
            values(progress=user_phrase.c.progress + progress)
        )
        self.db.execute(upd)


configure_handlers = make_handlers("/training/", [
    ("working-set", WorkingSetHandler),
    ("increment-progress", IncrementProgressHanlder)
])
