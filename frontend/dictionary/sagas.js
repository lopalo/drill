import {put} from "redux-saga/effects";
import {push} from "react-router-redux";
import {actions as formActions} from "react-redux-form";


import {
    REQUEST_LIST,
    REQUEST_THEMES,
    REQUEST_GRAMMAR_SECTIONS,

    REQUEST_CREATE_GRAMMAR_SECTION,
    REQUEST_DELETE_GRAMMAR_SECTION,

    REQUEST_CREATE_THEME,
    REQUEST_DELETE_THEME,

    REQUEST_PHRASE,
    REQUEST_CREATE_PHRASE,
    REQUEST_UPDATE_PHRASE,
    REQUEST_DELETE_PHRASE,
    REQUEST_ADD_TO_MY_DICT
} from "./actions";
import {setProperty} from "../common/actions";
import {
    fetchJSON,
    takeLatestSafely as takeLatest,
    takeEverySafely as takeEvery,
} from "../common/sagas";


function* doFetchList() {
    //TODO: yield select(listFilters)
    let list = yield* fetchJSON("/dictionary/list");
    yield put(setProperty("pages.dictionary.data.list", list));
}

function* fetchList() {
    yield* takeLatest(REQUEST_LIST, doFetchList);
}


function* fetchThemes() {
    yield* takeLatest(REQUEST_THEMES, function* () {
        let themes = yield* fetchJSON("/dictionary/themes");
        yield put(setProperty("pages.dictionary.data.themes", themes));
    });
}


function* fetchGrammarSections() {
    yield* takeLatest(REQUEST_GRAMMAR_SECTIONS, function* () {
        let gs = yield* fetchJSON("/dictionary/grammar-sections");
        yield put(setProperty("pages.dictionary.data.grammarSections", gs));
    });
}

function* createTheme() {
    yield* takeEvery(REQUEST_CREATE_THEME, function* ({title}) {
        let url = "/dictionary/themes";
        let data = {action: "create", title};
        let themes = yield* fetchJSON(url, data, {method: "POST"});
        yield put(setProperty("pages.dictionary.data.themes", themes));
    });
}

function* deleteTheme() {
    yield* takeEvery(REQUEST_DELETE_THEME, function* ({themeId}) {
        let url = "/dictionary/themes";
        let data = {action: "delete", id: themeId};
        let themes = yield* fetchJSON(url, data, {method: "POST"});
        yield put(setProperty("pages.dictionary.data.themes", themes));
    });
}

function* createGrammarSection() {
    yield* takeEvery(REQUEST_CREATE_GRAMMAR_SECTION, function* ({title}) {
        let url = "/dictionary/grammar-sections";
        let data = {action: "create", title};
        let gs = yield* fetchJSON(url, data, {method: "POST"});
        yield put(setProperty("pages.dictionary.data.grammarSections", gs));
    });
}

function* deleteGrammarSection() {
    let actionType = REQUEST_DELETE_GRAMMAR_SECTION;
    yield* takeEvery(actionType, function* ({sectionId}) {
        let url = "/dictionary/grammar-sections";
        let data = {action: "delete", id: sectionId};
        let gs = yield* fetchJSON(url, data, {method: "POST"});
        yield put(setProperty("pages.dictionary.data.grammarSections", gs));
    });
}



const phraseFormModel = "pages.dictionary.phrase";

function* fetchPhrase() {
    yield* takeLatest(REQUEST_PHRASE, function* ({phraseId}) {
        let phrase = yield* fetchJSON(`/dictionary/phrase/${phraseId}`);
        yield put(formActions.load(phraseFormModel, phrase));
    });
}

function* createPhrase() {
    yield* takeEvery(REQUEST_CREATE_PHRASE, function* ({data}) {
        yield* fetchJSON("/dictionary/create-phrase", data, {method: "POST"});
        yield put(push("dictionary"));
        yield* doFetchList();
    });
}


function* updatePhrase() {
    yield* takeEvery(REQUEST_UPDATE_PHRASE, function* ({phraseId, data}) {
        let url = `/dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, data, {method: "PUT"});
        yield* doFetchList();
    });
}


function* deletePhrase() {
    yield* takeEvery(REQUEST_DELETE_PHRASE, function* ({phraseId}) {
        let url = `/dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, null, {method: "DELETE"});
        yield* doFetchList();
    });
}


function* addPhraseToMyDict() {
    yield* takeEvery(REQUEST_ADD_TO_MY_DICT, function* ({phraseId}) {
        let data = {id: phraseId};
        yield* fetchJSON("/my-dictionary/add-phrase", data, {method: "POST"});
        yield* doFetchList();
    });
}


export default [
    fetchList,
    fetchThemes,
    fetchGrammarSections,
    fetchPhrase,
    createPhrase,
    updatePhrase,
    deletePhrase,
    addPhraseToMyDict,
    createTheme,
    deleteTheme,
    createGrammarSection,
    deleteGrammarSection
];
