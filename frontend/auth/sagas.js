import {put} from "redux-saga/effects";
import {actions as formActions} from "react-redux-form";

import {setProperty} from "../common/actions";
import {
    REQUEST_USER,
    REQUEST_LOGIN,
    REQUEST_REGISTER,
    REQUEST_LOGOUT
} from "./actions";
import {fetchJSON, takeLatestSafely as takeLatest} from "../common/sagas";


function* fetchUser() {
    yield* takeLatest(REQUEST_USER, function* () {
        yield put(setProperty("auth.isLoading", true));
        try {
            let user = yield* fetchJSON("/auth/user");
            yield put(setProperty("user", user));
        } catch (e) {
            if (e.response && e.response.status !== 401) {
                throw e;
            }
        }
        yield put(setProperty("auth.isLoading", false));
    });
}


function* login() {
    yield* takeLatest(REQUEST_LOGIN, function* (action) {
        yield put(formActions.reset("auth.login.password"));
        let response = yield* fetchJSON("/auth/login", action.formData);
        if (response.error !== null) {
            yield put(setProperty("auth.login.serverError", response.error));
        } else {
            yield put(setProperty("user", response.user));
        }
    });
}


function* register() {
    yield* takeLatest(REQUEST_REGISTER, function* (action) {
        yield put(formActions.reset("auth.register.password"));
        yield put(formActions.reset("auth.register.confirmPassword"));
        let response = yield* fetchJSON("/auth/register", action.formData);
        if (response.error !== null) {
            yield put(setProperty("auth.register.serverError", response.error));
        } else {
            yield put(setProperty("user", response.user));
        }
    });
}


function* logout() {
    yield* takeLatest(REQUEST_LOGOUT, function* () {
        yield* fetchJSON("/auth/logout", null, {method: "POST"});
    });
}


export default [
    fetchUser,
    login,
    register,
    logout
];

