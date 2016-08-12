import {combineReducers} from "redux";
import {modelReducer, formReducer} from "react-redux-form";


export const user = (state=null) => state;


const isLoading = (state=false) => state;



const initialLoginState = {
    email: "",
    password: "",
    serverError: null
};


const initialRegisterState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    serverError: null
};

export const auth = combineReducers({
    isLoading,
    login: modelReducer("auth.login", initialLoginState),
    loginForm: formReducer("auth.login", initialLoginState),
    register: modelReducer("auth.register", initialRegisterState),
    registerForm: formReducer("auth.register", initialRegisterState),
});



