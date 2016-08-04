import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import {requestProfile} from "../actions";
import Auth from "../components/Auth";


const mapStateToProps = s => ({
    isLoading: s.auth.isLoading
});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDidMount: requestProfile
}, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Auth);
