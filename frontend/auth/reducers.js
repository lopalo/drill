import {combineReducers} from "redux";

import {SET_USER, REQUEST_USER} from "./actions";


export const user = (state=null, action) => (
    action.type === SET_USER ? action.user : state
);

export const isLoading = (state=false, action) => {
    switch (action.type) {
        case REQUEST_USER:
            return true;
        case SET_USER:
            return false;
        default:
            return state;
    }
};


const login = (state={}) => state;


const register = (state={}) => state;


export const auth = combineReducers({isLoading, login, register});



