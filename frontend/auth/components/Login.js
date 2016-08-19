import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form} from "react-redux-form";
import validator from "validator";
import {createStructuredSelector} from "reselect";

import {requestLogin} from "../actions";
import FormGroup from "../../common/components/FormGroup";

const model = "auth.login";
const field = fieldName => `${model}.${fieldName}`;


const Login = ({serverError, onSubmit}) => (
  <div className="panel panel-info">
    <div className="panel-heading">
      <h3 className="panel-title">Login</h3>
    </div>
    <div className="panel-body">
      <Form model={model} onSubmit={onSubmit}
        validators={{
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

        <button type="submit" className="btn btn-default">
            Login
        </button>
      </Form>
    </div>
  </div>
);


const mapStateToProps = createStructuredSelector({
    serverError: state => state.auth.login.serverError
});


const mapDispatchToProps = dispatch => bindActionCreators({
    onSubmit: requestLogin
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
