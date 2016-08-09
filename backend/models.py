from sqlalchemy import (
    Table,
    Column,
    Integer,
    String,
    Boolean,
    MetaData,
    ForeignKey,
)
from sqlalchemy.sql import expression as ex

metadata = MetaData()


users = Table("users", metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(50), nullable=False),
    Column("email", String(50), unique=True, nullable=False),
    Column("password", String(60), nullable=False),
    Column("is_admin", Boolean, nullable=False, server_default=ex.false()),
)



