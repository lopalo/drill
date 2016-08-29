import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form} from "react-redux-form";
import {push} from "react-router-redux";
import {actions as formActions} from "react-redux-form";
import omit from "lodash/omit";

import {
    requestPhrase,
    requestCreatePhrase,
    requestUpdatePhrase
} from "../actions";
import FormGroup from "../../common/components/FormGroup";


const model = "pages.dictionary.phrase";
const field = fieldName => `${model}.${fieldName}`;

const EditForm = ({params: {phraseId}, onClose, onSubmit}) => (
  <div className="modal" style={{display: "initial"}}>
    <div className="modal-dialog">
      <div className="modal-content">
        <Form model={model} onSubmit={onSubmit}>
          <div className="modal-header">
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
            <h4 className="modal-title">
              {phraseId ? "Edit Phrase" : "Create Phrase"}
            </h4>
          </div>
          <div className="modal-body">

            <FormGroup model={field("sourceText")}>
              <label className="control-label">Source Text</label>
              <input type="text" className="form-control" />
            </FormGroup>

            <FormGroup model={field("targetText")}>
              <label className="control-label">Target Text</label>
              <input type="text" className="form-control" />
            </FormGroup>

            <FormGroup model={field("sourceLang")}>
              <label className="control-label">Source Lang</label>
              <select className="form-control">
                <option value="ru">ru</option>
                <option value="en">en</option>
              </select>
            </FormGroup>


            <FormGroup model={field("targetLang")}>
              <label className="control-label">Target Lang</label>
              <select className="form-control">
                <option value="ru">ru</option>
                <option value="en">en</option>
              </select>
            </FormGroup>
            //TODO: show targetLang and sourceLang read-only
            //TODO: fields for group editing


          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Save changes
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



const mapDispatchToProps = (
    dispatch,
    {params: {phraseId}}
) => bindActionCreators({
    onClose: () => push("dictionary"),
    onDidMount: phraseId ? requestPhrase(phraseId) : null,
    onWillUnmount: () => formActions.reset(model),
    onSubmit: phraseId ? requestUpdatePhrase(phraseId) : requestCreatePhrase
}, dispatch);

export default connect(
    null,
    mapDispatchToProps
)(PhraseEditor);


