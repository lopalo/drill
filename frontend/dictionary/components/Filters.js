import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import kebabCase from "lodash/kebabCase";

import {filters, grammarSectionList, themeList} from "../selectors";
import {languages} from "../../common/constants";
import {setFilter} from "../actions";

const Filters = ({filters, grammarSections, themes, onFilterChanged}) => (
  <div>
    <div className="has-feedback">
      <input
        type="search"
        className="form-control"
        placeholder="Search..."
        value={filters.text}
        onChange={e => onFilterChanged("text", e.target.value)}
        />
        <span className="glyphicon glyphicon-search form-control-feedback">
        </span>
      <br />
    </div>
    <div>
      <h4>Target Language</h4>
      <hr className="horizontal-divider"/>
      {languages.map(lang => (
        <div key={lang} className="radio">
          <label>
            <input
              type="radio"
              name="target-language"
              value={lang}
              checked={lang === filters.targetLanguage}
              onChange={e => onFilterChanged("targetLanguage", e.target.value)}
              />
            {lang}
          </label>
        </div>
      ))}
    </div>
    <GroupFilter
      groups={grammarSections}
      title="Grammar Sections"
      filterName="grammarSection"
      onFilterChanged={onFilterChanged}
      filters={filters} />
    <GroupFilter
      groups={themes}
      title="Themes"
      filterName="theme"
      onFilterChanged={onFilterChanged}
      filters={filters} />
  </div>
);


const GroupFilter = ({
    groups,
    title,
    filterName,
    onFilterChanged,
    filters
}) => (
  <div>
    <h4>{title}</h4>
    <hr className="horizontal-divider"/>
      <div key="all" className="radio">
        <label>
          <input
            type="radio"
            name={kebabCase(filterName)}
            value="all"
            checked={filters[filterName] === null}
            onChange={() => onFilterChanged(filterName, null)}
            />
          <b>All</b>
        </label>
      </div>
    {groups.map(i => (
      <div key={i.id} className="radio">
        <label>
          <input
            type="radio"
            name={kebabCase(filterName)}
            value={i.id}
            checked={i.id === filters[filterName]}
            onChange={e => onFilterChanged(
                filterName,
                parseInt(e.target.value)
            )}
            />
          {i.title}
          &nbsp; &nbsp;
          <span className="badge">{i.phraseAmount}</span>
        </label>
      </div>
    ))}
  </div>
);



const mapStateToProps = createStructuredSelector({
    filters,
    grammarSections: grammarSectionList,
    themes: themeList,
});


const mapDispatchToProps = dispatch => bindActionCreators({
    onFilterChanged: setFilter
}, dispatch);


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Filters);


