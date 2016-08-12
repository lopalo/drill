import {
    phraseIndex,
    nextPhraseIndex,
    targetWords
} from "./selectors";


export const REQUEST_WORKING_SET = "training/REQUEST_WORKING_SET";

export const COMPLETE_WORD = "training/COMPLETE_WORD";
export const DELETE_COMPLETED_WORD = "training/DELETE_COMPLETED_WORD";
export const PASS_PHRASE = "training/PASS_PHRASE";
export const GIVE_UP = "training/GIVE_UP";
export const LISTEN = "training/LISTEN";


export const requestWorkingSet = () => ({type: REQUEST_WORKING_SET});


export const completeWord = word => ({
    type: COMPLETE_WORD,
    word
});


export const deleteCompletedWord = () => ({type: DELETE_COMPLETED_WORD});


export const passPhrase = progress => () => (dispatch, getState) => {
    let state = getState();
    dispatch({
        type: PASS_PHRASE,
        phraseIndex: phraseIndex(state),
        nextPhraseIndex: nextPhraseIndex(state),
        progress: progress
    });
};


export const giveUp = () => (dispatch, getState) => {
    dispatch({
        type: GIVE_UP,
        targetWords: targetWords(getState())
    });
};


export const listen = () => ({type: LISTEN});
