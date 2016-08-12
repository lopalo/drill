import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {requestWorkingSet} from "../actions";
import {phrase} from "../selectors";


class TrainingWrapper extends React.Component {
    componentDidMount() {
        this.props.onDidMount();
    }
    render() {
        let {phrase, children} = this.props;
        if (phrase) return children;
        return (
          <div className="center">
            <div className="well well-lg">Nothing to train</div>
          </div>
        );
    }
}


const mapStateToProps = createStructuredSelector({phrase});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDidMount: requestWorkingSet
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainingWrapper);

