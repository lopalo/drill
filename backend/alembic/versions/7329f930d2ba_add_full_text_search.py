"""add full text search

Revision ID: 7329f930d2ba
Revises: 180ce654a676
Create Date: 2017-02-28 19:37:33.992593

"""

# revision identifiers, used by Alembic.
revision = '7329f930d2ba'
down_revision = '180ce654a676'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa
from models import gen_tsvector_for_lang, tsvector_for_lang


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('phrase_added_by_user_id_fkey', 'phrase', type_='foreignkey')
    op.create_foreign_key('added_by_user_id_fkey', 'phrase', 'user', ['added_by_user_id'], ['id'], onupdate='CASCADE', ondelete='SET NULL')
    op.execute(gen_tsvector_for_lang())
    idx_expr = sa.text("""
    tsvector_concat(
        tsvector_for_lang(phrase.source_lang, phrase.source_text),
        tsvector_for_lang(phrase.target_lang, phrase.target_text)
    )
    """)
    op.create_index('text_idx', 'phrase', [idx_expr], postgresql_using='gin')
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('text_idx'), table_name='phrase')
    op.drop_constraint('added_by_user_id_fkey', 'phrase', type_='foreignkey')
    op.create_foreign_key('phrase_added_by_user_id_fkey', 'phrase', 'phrase', ['added_by_user_id'], ['id'], onupdate='CASCADE', ondelete='SET NULL')
    op.execute("DROP FUNCTION {};".format(tsvector_for_lang))
    ### end Alembic commands ###
