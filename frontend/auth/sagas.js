import {takeLatest} from "redux-saga";
import {put} from "redux-saga/effects";

import {REQUEST_PROFILE, setProfile} from "./actions";
import {fetchJSON} from "../common/sagas";


function* fetchProfile() {
    yield* takeLatest(REQUEST_PROFILE, function* () {
        try {
            let profile = yield* fetchJSON("/profile");
            yield put(setProfile(profile));
        } catch (e) {
            yield put(setProfile(null));
        }
    });
}

const sagas = [
    fetchProfile
];

export default sagas;
