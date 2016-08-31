import {put, select} from "redux-saga/effects";

import {
    REQUEST_LIST,
    SET_PHRASE_PROGRESS,
    SET_PHRASE_REPEATS,
    RESET_PHRASE,
    REQUEST_DELETE_PHRASE
} from "./actions";
import {list} from "./selectors";
import {setProperty} from "../common/actions";
import {
    fetchJSON,
    takeLatestSafely as takeLatest,
    takeEverySafely as takeEvery
} from "../common/sagas";


function* doFetchList() {
    let list = yield* fetchJSON("/my-dictionary/list");
    yield put(setProperty("pages.myDictionary.list", list));
}


function* fetchList() {
    yield* takeLatest(REQUEST_LIST, doFetchList);
}


function* setPhraseProgress() {
    yield* takeLatest(SET_PHRASE_PROGRESS, function* (action) {
        let {index, progress} = action;
        let {id, repeats} = (yield select(list))[index];
        let fieldPath = `pages.myDictionary.list.${index}.progress`;
        let url = `/my-dictionary/phrase/${id}`;
        progress = Math.min(progress, repeats);
        yield put(setProperty(fieldPath, progress));
        yield* fetchJSON(url, {progress}, {method: "PATCH"});
    });
}


function* setPhraseRepeats() {
    yield* takeLatest(SET_PHRASE_REPEATS, function* (action) {
        let {index, repeats} = action;
        let {id, progress} = (yield select(list))[index];
        let progressPath = `pages.myDictionary.list.${index}.progress`;
        let repeatsPath = `pages.myDictionary.list.${index}.repeats`;
        let url = `/my-dictionary/phrase/${id}`;
        repeats = Math.min(30, repeats);
        progress = Math.min(progress, repeats);
        yield put(setProperty(progressPath, progress));
        yield put(setProperty(repeatsPath, repeats));
        yield* fetchJSON(url, {progress, repeats}, {method: "PATCH"});
    });
}


function* resetPhrase() {
    yield* takeLatest(RESET_PHRASE, function* ({index}) {
        let {id} = (yield select(list))[index];
        let progressPath = `pages.myDictionary.list.${index}.progress`;
        let timePath = `pages.myDictionary.list.${index}.completionTime`;
        let url = `/my-dictionary/phrase/${id}`;
        let data = {progress: 0, completionTime: null};
        yield put(setProperty(progressPath, 0));
        yield put(setProperty(timePath, null));
        yield* fetchJSON(url, data, {method: "PATCH"});
    });
}


function* deletePhrase() {
    yield* takeEvery(REQUEST_DELETE_PHRASE, function* ({phraseId}) {
        let url = `/my-dictionary/phrase/${phraseId}`;
        yield* fetchJSON(url, null, {method: "DELETE"});
        yield* doFetchList();
    });
}


export default [
    fetchList,
    setPhraseProgress,
    setPhraseRepeats,
    resetPhrase,
    deletePhrase
];
