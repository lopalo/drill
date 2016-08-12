import {setIn} from "icepick";
import toPath from "lodash/toPath";

import {SET_PROPERTY} from "./actions";

export const setProperty = (state, action) => {
    if (action.type === SET_PROPERTY) {
        return setIn(state, toPath(action.path), action.value);
    }
    return state;
};
