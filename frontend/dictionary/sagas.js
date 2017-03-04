import {delay} from "redux-saga";
import {put, select, take, spawn, fork} from "redux-saga/effects";
import {push} from "react-router-redux";
import {actions as formActions} from "react-redux-form";


import {
    REQUEST_PAGE_DATA,
    LOAD_MORE,

    REQUEST_CREATE_GRAMMAR_SECTION,
    REQUEST_DELETE_GRAMMAR_SECTION,

    REQUEST_CREATE_THEME,
    REQUEST_DELETE_THEME,

    REQUEST_PHRASE,
    REQUEST_CREATE_PHRASE,
    REQUEST_UPDATE_PHRASE,
    REQUEST_DELETE_PHRASE,

    REQUEST_ADD_TO_MY_DICT,
    SET_FILTER,
} from "./actions";
import * as actions from "./actions";
import {filters, list} from "./selectors";
import {setProperty} from "../common/actions";
import {
    fetchJSON,
    takeLatestSafely as takeLatest,
    takeEverySafely as takeEvery,
} from "../common/sagas";


function* doFetchList(more=false) {
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
    if (more) {
        let offset = (yield select(list)).length;
        url += `&offset=${offset}`;
    }
    let {list: lst, total} = yield* fetchJSON(url);
    if (more) {
        yield put(actions.extendList(lst));
    } else {
        yield put(setProperty("pages.dictionary.data.list", lst));
    }
    yield put(setProperty("pages.dictionary.data.total", total));
}

function* doFetchGroups() {
    yield fork(function* () {
        let themes = yield* fetchJSON("/dictionary/themes");
        yield put(setProperty("pages.dictionary.data.themes", themes));
    });
    yield fork(function* () {
        let gs = yield* fetchJSON("/dictionary/grammar-sections");
        yield put(setProperty("pages.dictionary.data.grammarSections", gs));
    });
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


function* fetchPageData() {
    yield* takeLatest(REQUEST_PAGE_DATA, function* () {
        yield fork(doFetchList);
        yield fork(doFetchGroups);
    });
}


function* loadMore() {
    yield* takeLatest(LOAD_MORE, () => doFetchList(true));
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
        let {id} = yield* fetchJSON(
            "/dictionary/create-phrase",
            data,
            {method: "POST"}
        );
        yield put(actions.createPhrase({...data, id}));
        yield put(push("dictionary"));
        yield* doFetchGroups();
    });
}


function* updatePhrase() {
    yield* takeEvery(REQUEST_UPDATE_PHRASE, function* ({phraseId, data}) {
        let url = `/dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, data, {method: "PUT"});
        yield put(formActions.setSubmitted(phraseFormModel, true));
        yield* doFetchGroups();
        yield* doFetchPhrase({phraseId});
        yield put(formActions.setInitial(phraseFormModel));
    });
}


function* deletePhrase() {
    yield* takeEvery(REQUEST_DELETE_PHRASE, function* ({phraseId}) {
        let url = `/dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, null, {method: "DELETE"});
        yield* doFetchGroups();
    });
}


function* addPhraseToMyDict() {
    yield* takeEvery(REQUEST_ADD_TO_MY_DICT, function* ({phraseId}) {
        let data = {id: phraseId};
        yield* fetchJSON("/my-dictionary/add-phrase", data, {method: "POST"});
    });
}


export default [
    fetchPageData,
    loadMore,
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
