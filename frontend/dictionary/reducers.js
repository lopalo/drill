import {combineReducers} from "redux";
import {modelReducer, formReducer} from "react-redux-form";
import {unshift} from "icepick";

import * as actions from "./actions";

const filters = (state={
    targetLanguage: "en",
    grammarSection: null,
    theme: null,
    text: ""
}, action) => (
    action.type === actions.SET_FILTER ?
    {...state, [action.fieldName]: action.value} : state
);

const list = (state=[], action) => {
    switch (action.type) {
        case actions.EXTEND_LIST:
            return [...state, ...action.list];
        case actions.CREATE_PHRASE:
            return unshift(state, {...action.data, modified: true});
        case actions.REQUEST_UPDATE_PHRASE:
            return state.map(i =>
                i.id === action.phraseId ?
                    {...i, ...action.data, modified: true} : i
            );
        case actions.REQUEST_DELETE_PHRASE:
            return state.filter(i => i.id !== action.phraseId);
        case actions.REQUEST_ADD_TO_MY_DICT:
            return state.map(i =>
                i.id === action.phraseId ? {...i, isInMyDict: true} : i
            );
        default:
            return state;
    }
};
const total = (state=0) => state;
const themes = (state=[]) => state;
const grammarSections = (state=[]) => state;

const data = combineReducers({
    list,
    total,
    themes,
    grammarSections
});

const initialPhraseState = {
    sourceText: "",
    targetText: "",
    grammarSections: [],
    themes: [],
};

export default combineReducers({
    filters,
    data,
    phrase: modelReducer("pages.dictionary.phrase", initialPhraseState),
    phraseForm: formReducer("pages.dictionary.phrase", initialPhraseState),
});

