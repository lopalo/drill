
export const REQUEST_WORKING_SET = "training/REQUEST_WORKING_SET";
export const SET_WORKING_SET = "training/SET_WORKING_SET";

export const COMPLETE_WORD = "training/COMPLETE_WORD";
export const DELETE_COMPLETED_WORD = "training/DELETE_COMPLETED_WORD";
export const PASS_PHRASE = "training/PASS_PHRASE";
export const GIVE_UP = "training/GIVE_UP";
export const LISTEN = "training/LISTEN";


export const requestWorkingSet = () => ({type: REQUEST_WORKING_SET});


export const setWorkingSet = (workingSet) => ({
    type: SET_WORKING_SET,
    workingSet
});


export const completeWord = word => ({
    type: COMPLETE_WORD,
    word
});


export const deleteCompletedWord = () => ({type: DELETE_COMPLETED_WORD});


export const passPhrase = progress => (phraseIndex, nextPhraseIndex) => ({
    type: PASS_PHRASE,
    phraseIndex,
    nextPhraseIndex,
    progress
});


export const giveUp = (targetWords) => ({
    type: GIVE_UP,
    targetWords
});


export const listen = () => ({type: LISTEN});
