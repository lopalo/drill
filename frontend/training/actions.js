import {
    phraseIndex,
    nextPhraseIndex,
    targetWords,
    phrase
} from "./selectors";


export const REQUEST_WORKING_SET = "training/REQUEST_WORKING_SET";
export const ADD_PHRASE = "training/ADD_PHRASE";

export const COMPLETE_WORD = "training/COMPLETE_WORD";
export const DELETE_COMPLETED_WORD = "training/DELETE_COMPLETED_WORD";
export const PASS_PHRASE = "training/PASS_PHRASE";
export const COMPLETE_PHRASE = "training/COMPLETE_PHRASE";
export const GIVE_UP = "training/GIVE_UP";
export const SPEAK = "training/SPEAK";


export const requestWorkingSet = () => ({type: REQUEST_WORKING_SET});


export const addPhrase = phrase => ({
    type: ADD_PHRASE,
    phrase
});


export const completeWord = word => ({
    type: COMPLETE_WORD,
    word
});


export const deleteCompletedWord = () => ({type: DELETE_COMPLETED_WORD});


export const passPhrase = progress => (dispatch, getState) => {
    let state = getState();
    let p = phrase(state);
    if (p.progress + progress >= p.repeats) {
        dispatch({
            type: COMPLETE_PHRASE,
            phraseIndex: phraseIndex(state),
            phraseId: p.id
        });
    } else {
        dispatch({
            type: PASS_PHRASE,
            phraseIndex: phraseIndex(state),
            nextPhraseIndex: nextPhraseIndex(state),
            progress: progress
        });
    }
};


export const giveUp = () => (dispatch, getState) => {
    dispatch({
        type: GIVE_UP,
        targetWords: targetWords(getState())
    });
};


export const speak = () => ({type: SPEAK});
