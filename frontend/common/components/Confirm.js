import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";



const Confirm = ({text, onYesClick, onNoClick}) => text && (
  <div className="modal" style={{display: "initial"}}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h4 className="modal-title">
            Confirm
          </h4>
        </div>
        <div className="modal-body">
          {text}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default"
            onClick={onYesClick}
            autoFocus={true}>
            Yes
          </button>
          <button type="button" className="btn btn-primary" onClick={onNoClick}>
            No
          </button>
        </div>
      </div>
    </div>
  </div>
);


const mapStateToProps = ({confirmData}) => (
    confirmData === null ? {text: null} : {text: confirmData.text}
);

const confirmAction = option => () => (dispatch, getState) => {
    let data = getState().confirmData;
    if (data === null) return;
    dispatch({type: data[option]});
};


const mapDispatchToProps = dispatch => bindActionCreators({
    onYesClick: confirmAction("yes"),
    onNoClick: confirmAction("no"),
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Confirm);

