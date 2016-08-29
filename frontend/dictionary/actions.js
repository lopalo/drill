

export const REQUEST_LIST = "dictionary/REQUEST_LIST";
export const REQUEST_THEMES = "dictionary/REQUEST_THEMES";
export const REQUEST_GRAMMAR_SECTIONS = "dictionary/REQUEST_GRAMMAR_SECTIONS";


export const REQUEST_CREATE_GRAMMAR_SECTION = (
    "dictionary/REQUEST_CREATE_GRAMMAR_SECTION"
);
export const REQUEST_DELETE_GRAMMAR_SECTION = (
    "dictionary/REQUEST_DELETE_GRAMMAR_SECTION"
);
export const REQUEST_CREATE_THEME = "dictionary/REQUEST_CREATE_THEME";
export const REQUEST_DELETE_THEME = "dictionary/REQUEST_DELETE_THEME";


export const REQUEST_PHRASE = "dictionary/REQUEST_PHRASE";
export const REQUEST_CREATE_PHRASE = "dictionary/REQUEST_CREATE_PHRASE";
export const REQUEST_UPDATE_PHRASE = "dictionary/REQUEST_UPDATE_PHRASE";
export const REQUEST_DELETE_PHRASE = "dictionary/REQUEST_DELETE_PHRASE";
export const REQUEST_ADD_TO_MY_DICT = "dictionary/REQUEST_ADD_TO_MY_DICT";


export const requestList = () => ({type: REQUEST_LIST});
export const requestThemes = () => ({type: REQUEST_THEMES});
export const requestGrammarSections = () => ({type: REQUEST_GRAMMAR_SECTIONS});


export const requestCreateGrammarSection = title => ({
    type: REQUEST_CREATE_GRAMMAR_SECTION,
    title
});

export const requestDeleteGrammarSection = sectionId => ({
    type: REQUEST_DELETE_GRAMMAR_SECTION,
    sectionId
});

export const requestCreateTheme = title => ({
    type: REQUEST_CREATE_THEME,
    title
});

export const requestDeleteTheme = themeId => ({
    type: REQUEST_DELETE_THEME,
    themeId
});

export const requestPhrase = phraseId => () => ({
    type: REQUEST_PHRASE,
    phraseId
});


export const requestCreatePhrase = data => ({
    type: REQUEST_CREATE_PHRASE,
    data
});


export const requestUpdatePhrase = phraseId => data => ({
    type: REQUEST_UPDATE_PHRASE,
    phraseId,
    data
});


export const requestDeletePhrase = phraseId => ({
    type: REQUEST_DELETE_PHRASE,
    phraseId
});


export const requestAddToMyDict = phraseId => ({
    type: REQUEST_ADD_TO_MY_DICT,
    phraseId
});

