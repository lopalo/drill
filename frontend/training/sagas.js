import {takeLatest} from "redux-saga";
import {put} from "redux-saga/effects";

import {REQUEST_TRAINING_SET, setTrainingSet} from "./actions";
import {fetchJSON} from "../common/sagas";


function* fetchTrainingSet() {
    yield* takeLatest(REQUEST_TRAINING_SET, function* () {
        try {
            let set = yield* fetchJSON("/training-set");
            yield put(setTrainingSet(set));
        } catch (e) {
            yield put(setTrainingSet([]));
        }
    });
}

//TODO: switch off activeVoice on PASS_PHRASE and LISTEN actions;
//TODO: increment progress on PASS_PHRASE if progress > 0;

const sagas = [
    fetchTrainingSet
];

export default sagas;
