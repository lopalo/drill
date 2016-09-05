import {delay} from "redux-saga";
import {put, select, take, spawn, fork} from "redux-saga/effects";
import {push} from "react-router-redux";
import {actions as formActions} from "react-redux-form";


import {
    REQUEST_PAGE_DATA,

    REQUEST_CREATE_GRAMMAR_SECTION,
    REQUEST_DELETE_GRAMMAR_SECTION,

    REQUEST_CREATE_THEME,
    REQUEST_DELETE_THEME,

    REQUEST_PHRASE,
    REQUEST_CREATE_PHRASE,
    REQUEST_UPDATE_PHRASE,
    REQUEST_DELETE_PHRASE,

    REQUEST_ADD_TO_MY_DICT,
    SET_FILTER

} from "./actions";
import {filters} from "./selectors";
import {setProperty} from "../common/actions";
import {
    fetchJSON,
    takeLatestSafely as takeLatest,
    takeEverySafely as takeEvery,
} from "../common/sagas";


function* doFetchList() {
    let fs = yield select(filters);
    let url = `/dictionary/list?target-language=${fs.targetLanguage}`;
    if (fs.grammarSection !== null) {
        url += `&grammar-section=${fs.grammarSection}`;
    }
    if (fs.theme !== null) {
        url += `&theme=${fs.theme}`;
    }
    if (fs.text) {
        url += `&text=${fs.text}`;
    }
    let list = yield* fetchJSON(url);
    yield put(setProperty("pages.dictionary.data.list", list));
}

function* monitorFilters() {
    let task = null;
    function* fetch() {
        yield delay(500);
        yield* doFetchList();
    }
    while (true) {
        yield take(SET_FILTER);
        if (task !== null) {
            task.cancel();
        }
        task = yield spawn(fetch);
    }

}

function* doFetchPageData() {
    yield fork(doFetchList);
    yield fork(function* () {
        let themes = yield* fetchJSON("/dictionary/themes");
        yield put(setProperty("pages.dictionary.data.themes", themes));
    });
    yield fork(function* () {
        let gs = yield* fetchJSON("/dictionary/grammar-sections");
        yield put(setProperty("pages.dictionary.data.grammarSections", gs));
    });
}

function* fetchPageData() {
    yield* takeLatest(REQUEST_PAGE_DATA, doFetchPageData);
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


function* doFetchPhrase({phraseId}) {
    let phrase = yield* fetchJSON(`/dictionary/phrase/${phraseId}`);
    yield put(formActions.load(phraseFormModel, phrase));
}

function* fetchPhrase() {
    yield* takeLatest(REQUEST_PHRASE, doFetchPhrase);
}

function* createPhrase() {
    yield* takeEvery(REQUEST_CREATE_PHRASE, function* ({data}) {
        yield* fetchJSON("/dictionary/create-phrase", data, {method: "POST"});
        yield put(push("dictionary"));
        yield* doFetchPageData();
    });
}


function* updatePhrase() {
    yield* takeEvery(REQUEST_UPDATE_PHRASE, function* ({phraseId, data}) {
        let url = `/dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, data, {method: "PUT"});
        yield put(formActions.setSubmitted(phraseFormModel, true));
        yield* doFetchPageData();
        yield* doFetchPhrase({phraseId});
        yield put(formActions.setInitial(phraseFormModel));
    });
}


function* deletePhrase() {
    yield* takeEvery(REQUEST_DELETE_PHRASE, function* ({phraseId}) {
        let url = `/dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, null, {method: "DELETE"});
        yield* doFetchPageData();
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
    fetchPageData,
    fetchPhrase,
    createPhrase,
    updatePhrase,
    deletePhrase,
    addPhraseToMyDict,
    monitorFilters,

    createTheme,
    deleteTheme,
    createGrammarSection,
    deleteGrammarSection
];
