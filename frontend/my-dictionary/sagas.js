import {takeLatest} from "redux-saga";
import {put} from "redux-saga/effects";

import {REQUEST_LIST} from "./actions";
import {setProperty} from "../common/actions";
import {fetchJSON} from "../common/sagas";


function* fetchList() {
    yield* takeLatest(REQUEST_LIST, function* () {
        let list = yield* fetchJSON("/my-dictionary/list");
        yield put(setProperty("pages.dictionary.list", list));
    });
}


export default [
    fetchList
];
