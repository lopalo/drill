
export const REQUEST_TRAINING_SET = "training/REQUEST_TRAINING_SET";
export const SET_TRAINING_SET = "training/SET_TRAINING_SET";

export const COMPLETE_WORD = "training/COMPLETE_WORD";
export const DELETE_COMPLETED_WORD = "training/DELETE_COMPLETED_WORD";
export const PASS_PHRASE = "training/PASS_PHRASE";
export const GIVE_UP = "training/GIVE_UP";
export const LISTEN = "training/LISTEN";


export const requestTrainingSet = () => ({type: REQUEST_TRAINING_SET});


export const setTrainingSet = (trainingSet) => ({
    type: SET_TRAINING_SET,
    trainingSet
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
