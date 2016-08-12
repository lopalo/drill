import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {requestLogout} from "../actions";


const Logout = ({onClick}) => (
  <a href="#" className="btn btn-link" onClick={onClick}>
    <span className="glyphicon glyphicon-log-out"></span>
  </a>
);

const mapDispatchToProps = dispatch => bindActionCreators({
    onClick: requestLogout
}, dispatch);

export default connect(null, mapDispatchToProps)(Logout);

