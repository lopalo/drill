import {combineReducers} from "redux";

import {profile, auth} from "./auth/reducers";
import training from "./training/reducers";
import myDictionary from "./my-dictionary/reducers";
import dictionary from "./dictionary/reducers";

const rootReducer = combineReducers({
    profile,
    auth,
    pages: combineReducers({
        training,
        myDictionary,
        dictionary
    })
});

export default rootReducer;
