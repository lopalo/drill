import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";

import {setProperty} from "./common/reducers";
import {user, auth} from "./auth/reducers";
import training from "./training/reducers";
import myDictionary from "./my-dictionary/reducers";
import dictionary from "./dictionary/reducers";

const reducer = combineReducers({
    user,
    auth,
    pages: combineReducers({
        training,
        myDictionary,
        dictionary
    }),
    routing: routerReducer
});


export default (state, action) => (
    reducer(setProperty(state, action), action)
);

