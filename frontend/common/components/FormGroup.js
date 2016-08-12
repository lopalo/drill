import React from "react";
import {connect} from "react-redux";
import {Field, Errors, utils} from "react-redux-form";


const FormGroup = ({model, errorMessages={}, field, children}) => (
  <Field model={model}
    className={"form-group " + (
        !field.valid && field.touched && !field.focus ? "has-error" : ""
    )}>
    {children}
    <Errors model={model}
      wrapper={props => <div className="help-block">{props.children}</div>}
      show={{touched: true, focus: false}}
      messages={errorMessages} />
  </Field>
);


const mapStateToProps = (state, props) => ({
    field: utils.getFieldFromState(state, props.model)
});

export default connect(mapStateToProps)(FormGroup);

