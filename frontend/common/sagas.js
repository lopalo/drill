import {call} from "redux-saga/effects";


export function* fetchJSON(url, options={}) {
    let opts = {
        method: "get",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: "same-origin",
        ...options
    };
    if (opts.body) {
        opts.body = JSON.stringify(opts.body);
    }
    let response = yield call(fetch, url, opts);
    return yield call(() => response.json());
}
