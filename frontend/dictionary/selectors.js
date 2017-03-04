import sortBy from "lodash/sortBy";
import {createSelector as create} from "reselect";


const dictionary = state => state.pages.dictionary;

const filters = create(dictionary, dictionary => dictionary.filters);

const data = create(dictionary, dictionary => dictionary.data);

const list = create(data, data => data.list);

const canLoadMore = create(data, data => data.list.length < data.total);

const grammarSections = create(data, data => data.grammarSections);

const grammarSectionList = create(
    grammarSections,
    grammarSections => sortBy(Object.values(grammarSections), i => i.title)
);

const themes = create(data, data => data.themes);

const themeList = create(
    themes,
    themes => sortBy(Object.values(themes), i => i.title)
);

export {
    filters,
    list,
    grammarSections,
    grammarSectionList,
    themes,
    themeList,
    canLoadMore
};
