import {put, select} from "redux-saga/effects";

import {
    REQUEST_LIST,
    SET_PHRASE_PROGRESS,
    SET_PHRASE_REPEATS,
    REQUEST_DELETE_PHRASE
} from "./actions";
import {list} from "./selectors";
import {setProperty} from "../common/actions";
import {fetchJSON, takeLatestSafely as takeLatest} from "../common/sagas";


function* doFetchList() {
    let list = yield* fetchJSON("/my-dictionary/list");
    yield put(setProperty("pages.myDictionary.list", list));
}


function* fetchList() {
    yield* takeLatest(REQUEST_LIST, doFetchList);
}


function* setPhraseProgress() {
    yield* takeLatest(SET_PHRASE_PROGRESS, function* (action) {
        let {phraseId, index, progress} = action;
        let fieldPath = `pages.myDictionary.list.${index}.progress`;
        let url = `/my-dictionary/phrase/${phraseId}`;
        let {repeats} = (yield select(list))[index];
        progress = Math.min(progress, repeats);
        yield put(setProperty(fieldPath, progress));
        yield* fetchJSON(url, {progress}, {method: "PATCH"});
    });
}


function* setPhraseRepeats() {
    yield* takeLatest(SET_PHRASE_REPEATS, function* (action) {
        let {phraseId, index, repeats} = action;
        let {progress} = (yield select(list))[index];
        let progressPath = `pages.myDictionary.list.${index}.progress`;
        let repeatsPath = `pages.myDictionary.list.${index}.repeats`;
        let url = `/my-dictionary/phrase/${phraseId}`;
        repeats = Math.min(30, repeats);
        progress = Math.min(progress, repeats);
        yield put(setProperty(progressPath, progress));
        yield put(setProperty(repeatsPath, repeats));
        yield* fetchJSON(url, {progress, repeats}, {method: "PATCH"});
    });
}


function* deletePhrase() {
    yield* takeLatest(REQUEST_DELETE_PHRASE, function* ({phraseId}) {
        let url = `/my-dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, null, {method: "DELETE"});
        yield* doFetchList();
    });
}


export default [
    fetchList,
    setPhraseProgress,
    setPhraseRepeats,
    deletePhrase
];
