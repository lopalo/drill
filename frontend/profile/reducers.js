
import {SET_FIELD} from "./actions";
import {languages} from "../common/constants";

const defaultState = {
    workingSetSize: 1,
    repeats: 1,
    completedRepeatFactor: 1,
    speakLanguage: languages[0],
    autoSpeak: true
};

export default (state=defaultState, action) =>
    action.type === SET_FIELD ?
    {...state, [action.fieldName]: action.value} : state;
