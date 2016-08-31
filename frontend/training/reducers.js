import {combineReducers} from "redux";
import initial from "lodash/initial";
import {updateIn, splice, push} from "icepick";

import * as actions from "./actions";

const initialUiState = {
    phraseIndex: 0,
    completedWords: [],
    isGivenUp: false,
    speechIsActive: false
};

const ui = (state=initialUiState, action) => {
    switch (action.type) {
        case actions.COMPLETE_WORD:
            return {
                ...state,
                completedWords: [...state.completedWords, action.word]
            };
        case actions.DELETE_COMPLETED_WORD:
            return {...state, completedWords: initial(state.completedWords)};
        case actions.PASS_PHRASE:
            return {...initialUiState, phraseIndex: action.nextPhraseIndex};
        case actions.COMPLETE_PHRASE:
            return {...initialUiState, phraseIndex: state.phraseIndex};
        case actions.GIVE_UP:
            return {
                ...state,
                isGivenUp: true,
                completedWords: action.targetWords
            };
        default:
            return state;
    }
};

const workingSet = (state=[], action) => {
    switch (action.type) {
        case actions.SET_WORKING_SET:
            return action.workingSet;
        case actions.PASS_PHRASE: {
            let idx = action.phraseIndex;
            return updateIn(state, [idx], p => phrase(p, action));
        }
        case actions.COMPLETE_PHRASE:
            return splice(state, action.phraseIndex, 1);
        case actions.ADD_PHRASE:
            return push(state, action.phrase);
        default:
            return state;
    }
};

const phrase = (state, action) => {
    switch (action.type) {
        case actions.PASS_PHRASE: {
            let {progress} = state;
            return {...state, progress: progress + action.progress};
        }
        default:
            return state;
    }
};


export default combineReducers({
    ui,
    workingSet
});




