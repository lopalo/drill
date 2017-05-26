import {combineReducers} from "redux";
import initial from "lodash/initial";
import difference from "lodash/difference";
import {updateIn, filter, unset} from "icepick";

import * as actions from "./actions";

const initialUiState = {
    ringQueue: [],
    completedWords: [],
    isGivenUp: false,
    speechIsActive: false
};

const ui = (state=initialUiState, action) => {
    let {completedWords, ringQueue} = state;
    switch (action.type) {
        case actions.RESET:
            return initialUiState;
        case actions.COMPLETE_WORD:
            return {
                ...state,
                completedWords: [...completedWords, action.word]
            };
        case actions.DELETE_COMPLETED_WORD:
            return {...state, completedWords: initial(completedWords)};
        case actions.PASS_PHRASE: {
            let [head, ...rest] = ringQueue;
            return {...initialUiState, ringQueue: [...rest, head]};
        }
        case actions.COMPLETE_PHRASE:
            return {
                ...initialUiState,
                ringQueue: filter(i => i != action.phraseId, ringQueue)
            };
        case actions.UPDATE_WORKING_SET: {
            let newPhraseIds = difference(action.set.map(p => p.id), ringQueue);
            return {
                ...state,
                ringQueue: [...ringQueue, ...newPhraseIds]
            };
        }
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

const workingSet = (state={}, action) => {
    switch (action.type) {
        case actions.PASS_PHRASE:
            return updateIn(state, [action.phraseId], p => phrase(p, action));
        case actions.COMPLETE_PHRASE:
            return unset(state, action.phraseId);
        case actions.UPDATE_WORKING_SET:
            return action.set.reduce(
                (state, phrase) =>
                    phrase.id in state ?
                        state : {...state, [phrase.id]: phrase},
                state
            );
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




