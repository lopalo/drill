

export const REQUEST_LIST = "dictionary/REQUEST_LIST";
export const REQUEST_PHRASE = "dictionary/REQUEST_PHRASE";
export const REQUEST_CREATE_PHRASE = "dictionary/REQUEST_CREATE_PHRASE";
export const REQUEST_UPDATE_PHRASE = "dictionary/REQUEST_UPDATE_PHRASE";
export const REQUEST_DELETE_PHRASE = "dictionary/REQUEST_DELETE_PHRASE";
export const REQUEST_ADD_TO_MY_DICT = "dictionary/REQUEST_ADD_TO_MY_DICT";


export const requestList = () => ({type: REQUEST_LIST});

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

