import {takeLatest} from "redux-saga";
import {put} from "redux-saga/effects";

import {REQUEST_WORKING_SET} from "./actions";
import {setProperty} from "../common/actions";
import {fetchJSON} from "../common/sagas";


function* fetchWorkingSet() {
    yield* takeLatest(REQUEST_WORKING_SET, function* () {
        let set = yield* fetchJSON("/training/working-set");
        yield put(setProperty("pages.training.workingSet", set));
    });
}

//TODO: switch off activeVoice on PASS_PHRASE and LISTEN actions;
//TODO: increment progress on PASS_PHRASE if progress > 0;

export default [
    fetchWorkingSet
];

