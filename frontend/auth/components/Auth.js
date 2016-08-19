import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";


import Login from "./Login";
import Register from "./Register";
import {requestUser} from "../actions";


class Auth extends React.Component {
    componentDidMount() {
        this.props.onDidMount();
    }
    render() {
        if (this.props.isLoading) {
            return (
              <div className="center">
                <div className="well well-lg">Loading...</div>
              </div>
            );
        }
        return (
          <div className="row center">
            <div>
              <div className="col-md-6"><Login /></div>
              <div className="col-md-6"><Register /></div>
            </div>
          </div>
        );
    }
}


const mapStateToProps = s => ({
    isLoading: s.auth.isLoading
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDidMount: requestUser
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Auth);
