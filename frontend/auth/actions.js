
export const REQUEST_USER = "auth/REQUEST_USER";
export const SET_USER = "auth/SET_USER";


export const requestUser = () => ({type: REQUEST_USER});


export const setUser = (user) => ({
    type: SET_USER,
    user
});
