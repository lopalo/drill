import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {requestWorkingSet} from "../actions";
import TrainingWrapper from "../components/TrainingWrapper";
import {phrase} from "../selectors";


const mapStateToProps = createStructuredSelector({phrase});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDidMount: requestWorkingSet
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainingWrapper);
