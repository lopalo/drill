import {combineReducers} from "redux";
import initial from "lodash/initial";

import * as actions from "./actions";

const initUiState = {
    phraseIndex: 0,
    completedWords: [],
    isGivenUp: false,
    activeVoice: null
};

const ui = (state=initUiState, action) => {
    switch (action.type) {
        case actions.COMPLETE_WORD:
            return {
                ...state,
                completedWords: [...state.completedWords, action.word]
            };
        case actions.DELETE_COMPLETED_WORD:
            return {...state, completedWords: initial(state.completedWords)};
        case actions.PASS_PHRASE:
            return {...initUiState, phraseIndex: action.nextPhraseIndex};
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
        case actions.PASS_PHRASE:
            return state.map((p, idx) => phrase(p, idx, action));
        default:
            return state;
    }
};

const phrase = (state, index, action) => {
    switch (action.type) {
        case actions.PASS_PHRASE: {
            if (index !== action.phraseIndex) return state;
            let {progress, repeats} = state;
            progress += action.progress;
            return {...state, progress: Math.min(progress, repeats)};
        }
        default:
            return state;
    }
};


const training = combineReducers({
    ui,
    data
});

export default training;



