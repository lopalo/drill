import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form, Errors} from "react-redux-form";
import validator from "validator";
import {createStructuredSelector} from "reselect";

import {requestRegister} from "../actions";
import FormGroup from "../../common/components/FormGroup";

const model = "auth.register";

const field = fieldName => `${model}.${fieldName}`;

const passwordsMatch = ({password, confirmPassword}) => (
    password === confirmPassword
);


const Register = ({serverError, onSubmit}) => (
  <div className="panel panel-info">
    <div className="panel-heading">
      <h3 className="panel-title">Register</h3>
    </div>
    <div className="panel-body">
      <Form model={model} onSubmit={onSubmit}
        validators={{
            "": {passwordsMatch},
            name: {
                length: v => validator.isLength(v, {min: 3})
            },
            email: {email: validator.isEmail},
            password: {
                length: v => validator.isLength(v, {min: 6})
            },
        }}>
        {serverError &&
          <div className="alert alert-danger">
            {serverError}
          </div>
        }

        <Errors model={model}
          wrapper={props => <p className="text-danger">{props.children}</p>}
          show={{submitFailed: true}}
          messages={{
              passwordsMatch: "Passwords are not matched"
          }} />


        <FormGroup model={field("name")}
                   errorMessages={{length: "Too short name"}}>
          <label className="control-label">Name</label>
          <input type="text" className="form-control" />
        </FormGroup>


        <FormGroup model={field("email")}
                   errorMessages={{email: "Is not a valid e-mail address"}}>
          <label className="control-label">E-mail</label>
          <input type="email" className="form-control" />
        </FormGroup>

        <FormGroup model={field("password")}
                   errorMessages={{length: "Too short password"}}>
          <label className="control-label">Password</label>
          <input type="password" className="form-control" />
        </FormGroup>

        <FormGroup model={field("confirmPassword")}>
          <label className="control-label">Confirm Password</label>
          <input type="password" className="form-control" />
        </FormGroup>

        <button type="submit" className="btn btn-default">
            Register
        </button>
      </Form>
    </div>
  </div>
);


const mapStateToProps = createStructuredSelector({
    serverError: state => state.auth.register.serverError
});


const mapDispatchToProps = dispatch => bindActionCreators({
    onSubmit: requestRegister
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);
