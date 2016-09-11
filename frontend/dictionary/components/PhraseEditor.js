import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form, Errors, utils} from "react-redux-form";
import {push} from "react-router-redux";
import omit from "lodash/omit";
import get from "lodash/get";
import validator from "validator";

import {
    requestPhrase,
    requestCreatePhrase,
    requestUpdatePhrase,
    resetTextFields
} from "../actions";
import {themeList, grammarSectionList} from "../selectors";
import FormGroup from "../../common/components/FormGroup";


const textDifference = ({sourceText, targetText}) => (
    sourceText.trim() !== targetText.trim()
);

const intList = l => l.map(i => parseInt(i));

const model = "pages.dictionary.phrase";
const field = fieldName => `${model}.${fieldName}`;

const EditForm = ({
    params: {phraseId},
    onClose,
    onSubmit,
    form,
    themes,
    grammarSections
}) => (
  <div className="modal" style={{display: "initial"}}>
    <div className="modal-dialog">
      <div className="modal-content">
        <Form model={model} onSubmit={onSubmit}
          validators={{
              "": {textDifference},
              sourceText: {
                  length: v => validator.isLength(v, {min: 3})
              },
              targetText: {
                  length: v => validator.isLength(v, {min: 3})
              },
          }}>

          <div className="modal-header">
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
            <h4 className="modal-title">
              {phraseId ? "Edit Phrase" : "Create Phrase"}
            </h4>
          </div>
          <div className="modal-body">

          <Errors model={model}
            wrapper={props => <p className="text-danger">{props.children}</p>}
            show={{submitFailed: true}}
            messages={{
                textDifference: "Target and source texts are equal"
            }} />

            <FormGroup model={field("sourceText")}
                       errorMessages={{length: "Too short text"}}>
              <label className="control-label">Source Text</label>
              <input type="text" className="form-control" />
            </FormGroup>

            <FormGroup model={field("targetText")}
                       errorMessages={{length: "Too short text"}}>
              <label className="control-label">Target Text</label>
              <input type="text" className="form-control" />
            </FormGroup>

            {phraseId &&
              <FormGroup model={field("sourceLang")}>
                <label className="control-label">Source Lang</label>
                <input type="text" className="form-control" readOnly />
              </FormGroup>
            }

            {phraseId &&
              <FormGroup model={field("targetLang")}>
                <label className="control-label">Target Lang</label>
                <input type="text" className="form-control" readOnly />
              </FormGroup>
            }

            <FormGroup model={field("grammarSections")} parser={intList}>
              <label className="control-label">Grammar Sections</label>
              <select multiple className="form-control">
                {grammarSections.map(i => (
                  <option key={i.id} value={i.id}>{i.title}</option>
                ))}
              </select>
            </FormGroup>

            <FormGroup model={field("themes")} parser={intList}>
              <label className="control-label">Themes</label>
              <select multiple className="form-control">
                {themes.map(i => (
                  <option key={i.id} value={i.id}>{i.title}</option>
                ))}
              </select>
            </FormGroup>

          </div>
          <div className="modal-footer">
            <span className={"text-success" + (
                             form.submitted ? "" : " disappearing")} >
              The changes have been saved
              &nbsp; &nbsp;
            </span>
            <button type="submit" className="btn btn-primary">
              {phraseId ? "Save changes" : "Submit"}
            </button>
            <button type="button" className="btn btn-default" onClick={onClose}>
              Close
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
);

class PhraseEditor extends React.Component {
    componentDidMount() {
        if (this.props.onDidMount) {
            this.props.onDidMount();
        }
    }
    componentWillUnmount() {
        this.props.onWillUnmount();
    }
    render() {
        let formProps = omit(this.props, "onDidMount", "onWillUnmount");
        return <EditForm {...formProps} />;
    }
}


const mapStateToProps = state => ({
    themes: themeList(state),
    grammarSections: grammarSectionList(state),
    form: utils.getForm(state, model),
    data: get(state, model)
});


const mapDispatchToProps = (
    dispatch,
    {params: {phraseId}}
) => bindActionCreators({
    onClose: () => push("dictionary"),
    onDidMount: phraseId ? () => requestPhrase(phraseId) : null,
    onWillUnmount: () => resetTextFields(model),
    onSubmit: phraseId ?
        data => requestUpdatePhrase(phraseId, data) : requestCreatePhrase
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PhraseEditor);


