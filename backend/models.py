from sqlalchemy import (
    Table,
    Column,
    Integer,
    String,
    Text,
    Boolean,
    Enum,
    MetaData,
    ForeignKey
)
from sqlalchemy.sql import expression as ex

metadata = MetaData()

Language = Enum("en", "ru", name="language", native_enum=True)


user = Table("user", metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(50), nullable=False),
    Column("email", String(50), unique=True, nullable=False),
    Column("password", String(60), nullable=False),
    Column("is_admin", Boolean, nullable=False, server_default=ex.false()),
)


phrase = Table("phrase", metadata,
    Column("id", Integer, primary_key=True),
    Column("source_text", Text, nullable=False),
    Column("target_text", Text, nullable=False),
    Column("source_lang", Language, nullable=False),
    Column("target_lang", Language, nullable=False),
)


grammar_section = Table("grammar_section", metadata,
    Column("id", Integer, primary_key=True),
    Column("title", Text, nullable=False),
)


theme = Table("theme", metadata,
    Column("id", Integer, primary_key=True),
    Column("title", Text, nullable=False),
)


grammar_section_phrase = Table(
    "grammar_section_phrase", metadata,
    Column("section_id",
           ForeignKey("grammar_section.id", onupdate="CASCADE"),
           primary_key=True),
    Column("phrase_id",
           ForeignKey("phrase.id", onupdate="CASCADE", ondelete="CASCADE"),
           primary_key=True,
           index=True)
)


theme_phrase = Table(
    "theme_phrase", metadata,
    Column("theme_id",
           ForeignKey("theme.id", onupdate="CASCADE"),
           primary_key=True),
    Column("phrase_id",
           ForeignKey("phrase.id", onupdate="CASCADE", ondelete="CASCADE"),
           primary_key=True,
           index=True)
)







