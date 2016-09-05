import React from "react";
import {Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import List from "./List";
import Filters from "./Filters";
import {requestPageData} from "../actions";

import {isAdmin} from "../../common/selectors";


class Dictionary extends React.Component {
    componentDidMount() {
        this.props.onDidMount();
    }
    render() {
        let {children, isAdmin} = this.props;
        return (
          <div>
            {children}
            {isAdmin &&
              <div className="row">
                <div className="col-md-12">
                  <p className="pull-right">
                    <Link
                      to="dictionary/create-phrase"
                      className="btn btn-primary">
                      Create Phrase
                    </Link>
                    <Link
                      to="dictionary/edit-groups"
                      className="btn btn-primary">
                      Edit Groups
                    </Link>
                  </p>
                </div>
              </div>
            }
            <div className="row">
              <div className="col-md-2">
                <Filters />
              </div>
              <div className="col-md-10">
                <List />
              </div>
            </div>
          </div>
        );
    }
}


const mapStateToProps = createStructuredSelector({isAdmin});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDidMount: requestPageData
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dictionary);

