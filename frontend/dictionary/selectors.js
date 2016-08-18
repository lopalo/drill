
import {createSelector as create} from "reselect";

const dictionary = state => state.pages.dictionary;

const list = create(dictionary, dictionary => dictionary.list);

export {
    list
};
