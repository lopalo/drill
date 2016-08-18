import {combineReducers} from "redux";
import {modelReducer, formReducer} from "react-redux-form";

const ui = (state={}) => state;
const list = (state=[]) => state;

const initialPhraseState = {
    sourceText: "",
    targetText: "",
    sourceLang: "ru",
    targetLang: "en"
};

export default combineReducers({
    ui,
    list,
    phrase: modelReducer("pages.dictionary.phrase", initialPhraseState),
    phraseForm: formReducer("pages.dictionary.phrase", initialPhraseState),
});

