import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {requestTrainingSet} from "../actions";
import TrainingWrapper from "../components/TrainingWrapper";
import {phrase} from "../selectors";


const mapStateToProps = createStructuredSelector({phrase});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDidMount: requestTrainingSet
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainingWrapper);
