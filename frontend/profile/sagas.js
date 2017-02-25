
import {put, select} from "redux-saga/effects";

import {
    SET_FIELD
} from "./actions";
import {
    fetchJSON,
    takeEverySafely as takeEvery
} from "../common/sagas";

function* setPhraseRepeats() {
    yield* takeEvery(SET_FIELD, function* ({fieldName, value}) {
        yield* fetchJSON("/profile", {fieldName, value}, {method: "PATCH"});
    });
}


export default [
    setPhraseRepeats
];
