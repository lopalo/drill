import {combineReducers} from "redux";
import {modelReducer, formReducer} from "react-redux-form";

import {SET_FILTER} from "./actions";

const filters = (state={
    targetLanguage: "en",
    grammarSection: null,
    theme: null,
    text: ""
}, action) => (
    action.type === SET_FILTER ?
    {...state, [action.fieldName]: action.value} : state
);

const list = (state=[]) => state;
const themes = (state=[]) => state;
const grammarSections = (state=[]) => state;

const data = combineReducers({
    list,
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

