import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {push} from "react-router-redux";
import {createStructuredSelector} from "reselect";

import {
    requestCreateGrammarSection,
    requestDeleteGrammarSection,
    requestCreateTheme,
    requestDeleteTheme,
} from "../actions";

import {grammarSectionList, themeList} from "../selectors";



const GroupsEditor = ({
    onClose,
    grammarSectionList,
    themeList,
    onAddTheme,
    onDeleteTheme,
    onAddGrammarSection,
    onDeleteGrammarSection,
}) => (
  <div className="modal" style={{display: "initial"}}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          <h4 className="modal-title">
            Groups Editor
          </h4>
        </div>
        <div className="modal-body">
          <div className="row">
            <List title="Grammar Sections"
              data={grammarSectionList}
              onAdd={onAddGrammarSection}
              onDelete={onDeleteGrammarSection}/>
            <List title="Themes"
              data={themeList}
              onAdd={onAddTheme}
              onDelete={onDeleteTheme}/>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);


const List = ({title, data, onAdd, onDelete}) => (
  <ul className="col-md-6 list-group">
    <li className="list-group-item active">{title}</li>
    {data.map(i => (
      <li key={i.id} className="list-group-item">
        <span className="badge">{i.phraseAmount}</span>
        {i.title}
        {!i.phraseAmount &&
          <button className="btn btn-link btn-xs"
            onClick={() => onDelete(i.id)}>
            <span className="glyphicon glyphicon-trash"></span>
          </button>}
      </li>
    ))}
    <li className="list-group-item"><AddItem onAdd={onAdd} /></li>
  </ul>
);

class AddItem extends React.Component {
    constructor(props) {
        super(props);
        this._input = null;
    }
    get value() {
        return this._input && this._input.value.trim();
    }
    handleClick() {
        if (!this.value) return;
        this.props.onAdd(this.value);
        this._input.value = "";
    }
    render() {
        return (
          <div className="input-group">
            <input type="text"
              className="form-control"
              onChange={() => this.forceUpdate()}
              ref={i => this._input = i} />
            <span className="input-group-btn">
              <button className="btn btn-default"
                disabled={!this.value}
                onClick={() => this.handleClick()}>
                <span className="glyphicon glyphicon-plus"></span>
              </button>
            </span>
          </div>
        );
    }
}


const mapStateToProps = createStructuredSelector({
    grammarSectionList,
    themeList
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onClose: () => push("dictionary"),
    onAddTheme: requestCreateTheme,
    onDeleteTheme: requestDeleteTheme,
    onAddGrammarSection: requestCreateGrammarSection,
    onDeleteGrammarSection: requestDeleteGrammarSection
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GroupsEditor);


