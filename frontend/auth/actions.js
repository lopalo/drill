import {actions as formActions} from "react-redux-form";

import {setProperty} from "../common/actions";

export const REQUEST_USER = "auth/REQUEST_USER";
export const REQUEST_LOGIN = "auth/REQUEST_LOGIN";
export const REQUEST_REGISTER = "auth/REQUEST_REGISTER";
export const REQUEST_LOGOUT = "auth/REQUEST_LOGOUT";


export const requestUser = () => ({type: REQUEST_USER});


export const requestLogin = formData => ({
    type: REQUEST_LOGIN,
    formData
});


export const requestRegister = formData => ({
    type: REQUEST_REGISTER,
    formData
});


export const resetForms = () => dispatch => {
    dispatch(formActions.reset("auth.login"));
    dispatch(setProperty("auth.login.serverError", null));
    dispatch(formActions.reset("auth.register"));
    dispatch(setProperty("auth.register.serverError", null));
};


export const requestLogout = () => ({type: REQUEST_LOGOUT});
