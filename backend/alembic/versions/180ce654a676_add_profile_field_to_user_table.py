"""add profile field to user table

Revision ID: 180ce654a676
Revises: f9cfece8ecfe
Create Date: 2017-02-18 09:48:43.204901

"""

# revision identifiers, used by Alembic.
revision = '180ce654a676'
down_revision = 'f9cfece8ecfe'
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('profile', postgresql.JSON(), server_default='{}', nullable=False))
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'profile')
    ### end Alembic commands ###
