import {takeLatest} from "redux-saga";
import {put} from "redux-saga/effects";

import {REQUEST_USER, setUser} from "./actions";
import {fetchJSON} from "../common/sagas";


function* fetchUser() {
    yield* takeLatest(REQUEST_USER, function* () {
        try {
            let user = yield* fetchJSON("/auth/user");
            yield put(setUser(user));
        } catch (e) {
            yield put(setUser(null));
        }
    });
}

const sagas = [
    fetchUser
];

export default sagas;
