import React from "react";

import Login from "../containers/Login";
import Register from "../containers/Register";

export default class Auth extends React.Component {
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
            <div className="col-md-6"><Login /></div>
            <div className="col-md-6"><Register /></div>
          </div>
        );
    }
}

