import {call} from "redux-saga/effects";


export function* fetchJSON(url, body=null, options={}) {
    let opts = {
        method: "get",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        credentials: "same-origin",
        ...options
    };
    if (body !== null) {
        opts.method = "post";
        opts.body = JSON.stringify(body);
    }
    let response = yield call(fetch, url, opts);
    if (response.status >= 200 && response.status < 300) {
        return yield call(() => response.json());
    }
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
}
