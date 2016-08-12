
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


export const requestLogout = () => ({type: REQUEST_LOGOUT});
