import {combineReducers} from "redux";
import initial from "lodash/initial";
import {updateIn} from "icepick";

import * as actions from "./actions";

const initialUiState = {
    phraseIndex: 0,
    completedWords: [],
    isGivenUp: false,
    activeVoice: null
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

const data = (state=[], action) => {
    switch (action.type) {
        case actions.SET_WORKING_SET:
            return action.workingSet;
        case actions.PASS_PHRASE: {
            let idx = action.phraseIndex;
            return updateIn(state, [idx], p => phrase(p, action));
        }
        default:
            return state;
    }
};

const phrase = (state, action) => {
    switch (action.type) {
        case actions.PASS_PHRASE: {
            let {progress, repeats} = state;
            progress += action.progress;
            return {...state, progress: Math.min(progress, repeats)};
        }
        default:
            return state;
    }
};


export default combineReducers({
    ui,
    data
});




