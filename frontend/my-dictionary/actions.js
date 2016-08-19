

export const REQUEST_LIST = "my-dictionary/REQUEST_LIST";
export const SET_PHRASE_PROGRESS = "my-dictionary/SET_PHRASE_PROGRESS";
export const SET_PHRASE_REPEATS = "my-dictionary/SET_PHRASE_REPEATS";
export const REQUEST_DELETE_PHRASE = "my-dictionary/REQUEST_DELETE_PHRASE";


export const requestList = () => ({type: REQUEST_LIST});


export const setPhraseProgress = (phraseId, index, progress) => ({
    type: SET_PHRASE_PROGRESS,
    phraseId,
    index,
    progress: progress || 0,
});


export const setPhraseRepeats = (phraseId, index, repeats) => ({
    type: SET_PHRASE_REPEATS,
    phraseId,
    index,
    repeats: repeats || 0,
});


export const requestDeletePhrase = phraseId => ({
    type: REQUEST_DELETE_PHRASE,
    phraseId
});

