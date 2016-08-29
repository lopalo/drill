import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import List from "./List";
import {requestList, requestThemes, requestGrammarSections} from "../actions";

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
              <p className="pull-right">
                <Link to="dictionary/create-phrase" className="btn btn-primary">
                  Create Phrase
                </Link>
                <Link to="dictionary/edit-groups" className="btn btn-primary">
                  Edit Groups
                </Link>
              </p>
            }
            <List />
          </div>
        );
    }
}

const mapStateToProps = createStructuredSelector({isAdmin});

const mapDispatchToProps = dispatch => ({
    onDidMount: () => {
        dispatch(requestList());
        dispatch(requestGrammarSections());
        dispatch(requestThemes());
    }
});


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dictionary);

