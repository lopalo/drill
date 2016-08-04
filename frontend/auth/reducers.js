import {combineReducers} from "redux";

import {SET_PROFILE, REQUEST_PROFILE} from "./actions";


export const profile = (state=null, action) => (
    action.type === SET_PROFILE ? action.profile : state
);

export const isLoading = (state=false, action) => {
    switch (action.type) {
        case REQUEST_PROFILE:
            return true;
        case SET_PROFILE:
            return false;
        default:
            return state;
    }
};


const login = (state={}) => state;


const register = (state={}) => state;


export const auth = combineReducers({isLoading, login, register});



