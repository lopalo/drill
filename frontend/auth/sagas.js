import {delay} from "redux-saga";
import {put, select} from "redux-saga/effects";
import {actions as formActions} from "react-redux-form";

import {setProperty} from "../common/actions";
import {
    REQUEST_USER,
    REQUEST_LOGIN,
    REQUEST_REGISTER,
    REQUEST_LOGOUT
} from "./actions";
import {fetchJSON, takeLatestSafely as takeLatest} from "../common/sagas";


function* initUser(user) {
    let profile = user.profile;
    delete user.profile;
    yield put(setProperty("user", user));
    yield put(setProperty("profile", profile));
}


function* fetchUser() {
    yield* takeLatest(REQUEST_USER, function* () {
        yield put(setProperty("auth.isLoading", true));
        try {
            let user = yield* fetchJSON("/auth/user");
            yield* initUser(user);
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
            yield* initUser(response.user);
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
            yield* initUser(response.user);
        }
    });
}


function* logout() {
    yield* takeLatest(REQUEST_LOGOUT, function* () {
        yield* fetchJSON("/auth/logout", null, {method: "POST"});
    });
}


function* checkSession() {
    let isLoggedIn;
    while (true) {
        yield delay(1000);
        isLoggedIn = yield select(s => s.user !== null);
        if (isLoggedIn && !document.cookie.includes("session_id")) {
            location.reload();
        }
    }
}


export default [
    fetchUser,
    login,
    register,
    logout,
    checkSession
];

