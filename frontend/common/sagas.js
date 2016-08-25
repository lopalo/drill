import {takeEvery, takeLatest} from "redux-saga";
import {call, put, take} from "redux-saga/effects";

import {CONFIRM_ACTION, setProperty} from "./actions";


export function* fetchJSON(url, body=null, options={}) {
    let opts = {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: "same-origin",
        ...options
    };
    if (body !== null) {
        if (opts.method === "GET") {
            opts.method = "POST";
        }
        opts.body = JSON.stringify(body);
    }
    let response = yield call(fetch, url, opts);
    if (response.status >= 200 && response.status < 300) {
        try {
            return yield call(() => response.json());
        }
        catch (e) {
            return null;
        }
    }
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
}


export function* takeEverySafely(pattern, saga, ...args) {
    while (true) {
        try {
            yield call(takeEvery, pattern, saga, ...args);
        } catch (e) {
            console.error(e, e.stack);
        }
    }
}


export function* takeLatestSafely(pattern, saga, ...args) {
    while (true) {
        try {
            yield call(takeLatest, pattern, saga, ...args);
        } catch (e) {
            console.error(e, e.stack);
        }
    }
}


function* confirmAction() {
    yield* takeEverySafely(CONFIRM_ACTION, function* ({text, action}) {
        let yes = Symbol("Yes");
        let no = Symbol("No");
        yield put(setProperty("confirmData", {text, yes, no}));
        let answer = yield take([yes, no]);
        yield put(setProperty("confirmData", null));
        if (answer.type === yes) {
            yield put(action);
        }
    });
}


export default [
    confirmAction
];
