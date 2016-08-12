import {takeLatest} from "redux-saga";
import {put} from "redux-saga/effects";
import {actions as formActions} from "react-redux-form";

import {setProperty} from "../common/actions";
import {
    REQUEST_USER,
    REQUEST_LOGIN,
    REQUEST_REGISTER,
    REQUEST_LOGOUT
} from "./actions";
import {fetchJSON} from "../common/sagas";


function* fetchUser() {
    yield* takeLatest(REQUEST_USER, function* () {
        yield put(setProperty("auth.isLoading", true));
        try {
            let user = yield* fetchJSON("/auth/user");
            yield put(setProperty("user", user));
        } catch (e) {
            yield put(setProperty("user", null));
        }
        yield put(setProperty("auth.isLoading", false));
    });
}


function* resetForms() {
    yield put(formActions.reset("auth.login"));
    yield put(setProperty("auth.login.serverError", null));
    yield put(formActions.reset("auth.register"));
    yield put(setProperty("auth.register.serverError", null));
}


function* login() {
    yield* takeLatest(REQUEST_LOGIN, function* (action) {
        try {
            let response = yield* fetchJSON("/auth/login", action.formData);
            if (response.error !== null) {
                yield put(setProperty(
                    "auth.login.serverError",
                    response.error
                ));
            } else {
                yield put(setProperty("user", response.user));
            }
        } catch (e) {
            yield put(setProperty("auth.login.serverError", "Network error"));
        }
        yield put(formActions.reset("auth.login.password"));
    });
}


function* register() {
    yield* takeLatest(REQUEST_REGISTER, function* (action) {
        try {
            let response = yield* fetchJSON("/auth/register", action.formData);
            if (response.error !== null) {
                yield put(setProperty(
                    "auth.register.serverError",
                    response.error
                ));
            } else {
                yield put(setProperty("user", response.user));
            }
        } catch (e) {
            yield put(setProperty("auth.register.serverError", "Network error"));
        }
        yield put(formActions.reset("auth.register.password"));
        yield put(formActions.reset("auth.register.confirmPassword"));
    });
}


function* logout() {
    yield* takeLatest(REQUEST_LOGOUT, function* () {
        yield* resetForms();
        yield* fetchJSON("/auth/logout", null, {method: "post"});
        yield put(setProperty("user", null));
    });
}



export default [
    fetchUser,
    login,
    register,
    logout
];

