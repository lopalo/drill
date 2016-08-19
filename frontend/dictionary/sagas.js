import {put} from "redux-saga/effects";
import {push} from "react-router-redux";
import {actions as formActions} from "react-redux-form";


import {
    REQUEST_LIST,
    REQUEST_PHRASE,
    REQUEST_CREATE_PHRASE,
    REQUEST_UPDATE_PHRASE,
    REQUEST_DELETE_PHRASE,
    REQUEST_ADD_TO_MY_DICT
} from "./actions";
import {setProperty} from "../common/actions";
import {fetchJSON, takeLatestSafely as takeLatest} from "../common/sagas";


function* doFetchList() {
    //TODO: yield select(listFilters)
    let list = yield* fetchJSON("/dictionary/list");
    yield put(setProperty("pages.dictionary.list", list));
}


function* fetchList() {
    yield* takeLatest(REQUEST_LIST, doFetchList);
}

const formModel = "pages.dictionary.phrase";

function* fetchPhrase() {
    yield* takeLatest(REQUEST_PHRASE, function* ({phraseId}) {
        let phrase = yield* fetchJSON(`/dictionary/phrase/${phraseId}`);
        yield put(formActions.load(formModel, phrase));
    });
}

function* createPhrase() {
    yield* takeLatest(REQUEST_CREATE_PHRASE, function* ({data}) {
        yield* fetchJSON("/dictionary/create-phrase", data, {method: "POST"});
        yield put(push("dictionary"));
        yield* doFetchList();
    });
}


function* updatePhrase() {
    yield* takeLatest(REQUEST_UPDATE_PHRASE, function* ({phraseId, data}) {
        let url = `/dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, data, {method: "PUT"});
        yield* doFetchList();
    });
}


function* deletePhrase() {
    yield* takeLatest(REQUEST_DELETE_PHRASE, function* ({phraseId}) {
        let url = `/dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, null, {method: "DELETE"});
        yield* doFetchList();
    });
}


function* addPhraseToMyDict() {
    yield* takeLatest(REQUEST_ADD_TO_MY_DICT, function* ({phraseId}) {
        let data = {id: phraseId};
        yield* fetchJSON("/my-dictionary/add-phrase", data, {method: "POST"});
        yield* doFetchList();
    });
}


export default [
    fetchList,
    fetchPhrase,
    createPhrase,
    updatePhrase,
    deletePhrase,
    addPhraseToMyDict,
];
