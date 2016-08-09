import {combineReducers} from "redux";

import {user, auth} from "./auth/reducers";
import training from "./training/reducers";
import myDictionary from "./my-dictionary/reducers";
import dictionary from "./dictionary/reducers";

const rootReducer = combineReducers({
    user,
    auth,
    pages: combineReducers({
        training,
        myDictionary,
        dictionary
    })
});

export default rootReducer;
