from sqlalchemy import (
    Table,
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    Enum,
    MetaData,
    ForeignKey,
    CheckConstraint,
    Index
)
from sqlalchemy.sql import (
    expression as ex,
    func as f,
    column as col,
    text
)
from sqlalchemy.dialects.postgresql import JSON

PG_REG_CONFIG = {"en": "english", "ru": "russian"}

metadata = MetaData()

Language = Enum("en", "ru", name="language", native_enum=True)

tsvector_for_lang = "tsvector_for_lang(lang language, txt text)"

def gen_tsvector_for_lang():
    options = " ".join("WHEN '{}' THEN '{}'".format(*i)
                       for i in PG_REG_CONFIG.items())
    template = """
    CREATE FUNCTION {func_name} RETURNS tsvector AS $$
    BEGIN
        RETURN to_tsvector(
            CASE lang {options} ELSE '{default}' END :: regconfig,
            txt
        );
    END;
    $$
    LANGUAGE plpgsql
    IMMUTABLE;
    """
    return template.format(
        func_name=tsvector_for_lang,
        options=options,
        default=PG_REG_CONFIG["en"])


user_model = Table(
    "user", metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(50), nullable=False),
    Column("email", String(50), unique=True, nullable=False),
    Column("password", String(60), nullable=False),
    Column("is_admin", Boolean, nullable=False, server_default=ex.false()),
    Column("profile", JSON, nullable=False, server_default="{}"),
)


phrase = Table(
    "phrase", metadata,
    Column("id", Integer, primary_key=True),
    Column("source_text", Text, nullable=False),
    Column("target_text", Text, nullable=False),
    Column("source_lang", Language, nullable=False),
    Column("target_lang", Language, nullable=False),
    Column("added_by_user_id",
           ForeignKey("user.id", onupdate="CASCADE", ondelete="SET NULL"),
           index=True)
)

phrase_text = f.tsvector_concat(
    f.tsvector_for_lang(phrase.c.source_lang, phrase.c.source_text),
    f.tsvector_for_lang(phrase.c.target_lang, phrase.c.target_text))

Index("text_idx", phrase_text, postgresql_using="gin")


grammar_section = Table(
    "grammar_section", metadata,
    Column("id", Integer, primary_key=True),
    Column("title", Text, nullable=False, unique=True),
)


theme = Table(
    "theme", metadata,
    Column("id", Integer, primary_key=True),
    Column("title", Text, nullable=False, unique=True),
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


user_phrase = Table(
    "user_phrase", metadata,
    Column("user_id",
           ForeignKey("user.id", onupdate="CASCADE", ondelete="CASCADE"),
           primary_key=True),
    Column("phrase_id",
           ForeignKey("phrase.id", onupdate="CASCADE", ondelete="CASCADE"),
           primary_key=True,
           index=True),
    Column("completion_time", DateTime(timezone=True), index=True),
    Column("repeats", Integer, nullable=False),
    Column("progress", Integer, nullable=False, server_default="0"),
    CheckConstraint(col("progress") <= col("repeats"))
)

