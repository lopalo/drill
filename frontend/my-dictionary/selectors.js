import {createSelector as create} from "reselect";

const dictionary = state => state.pages.myDictionary;

const list = create(dictionary, dictionary => dictionary.list);

export {
    list
};
