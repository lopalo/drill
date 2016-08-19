import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {isAdmin} from "../../common/selectors";
import {
    requestList,
    setPhraseProgress,
    setPhraseRepeats,
    requestDeletePhrase
} from "../actions";
import {list} from "../selectors";


class List extends React.Component {
    componentDidMount() {
        this.props.onDidMount();
    }
    render() {
        let {
            list,
            onProgressChanged,
            onRepeatsChanged,
            onDelete
        } = this.props;
        return (
          <table className="table">
            <thead>
              <tr>
                <th>Source Text</th>
                <th>Target Text</th>
                <th>Progress</th>
                <th>Repeats</th>
                <th>Completion Time</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row, idx) =>
                <ListItem
                  key={row.id} row={row}
                  onProgressChanged={v => onProgressChanged(row.id, idx, v)}
                  onRepeatsChanged={v => onRepeatsChanged(row.id, idx, v)}
                  onDelete={() => onDelete(row.id)} />
              )}
            </tbody>
          </table>
        );
    }
}


const ListItem = ({row, onProgressChanged, onRepeatsChanged, onDelete}) => (
  <tr>
    <td>{row.sourceText}</td>
    <td>{row.targetText}</td>
    <td className="col-md-1">
      <input
        type="number"
        step="1" min="0" max={row.repeats}
        value={row.progress}
        onChange={e => onProgressChanged(parseInt(e.target.value))}
        className="form-control input-sm" />
    </td>
    <td className="col-md-1">
      <input
        type="number"
        step="1" min="1" max="30"
        value={row.repeats}
        onChange={e => onRepeatsChanged(parseInt(e.target.value))}
        className="form-control input-sm" />
    </td>
    <td>{row.completionTime}</td>
    <td>
     <button className="btn btn-default" onClick={onDelete}>
      <span className="glyphicon glyphicon-trash"></span>
     </button>
    </td>
  </tr>
);


const mapStateToProps = createStructuredSelector({list, isAdmin});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDidMount: requestList,
    onProgressChanged: setPhraseProgress,
    onRepeatsChanged: setPhraseRepeats,
    onDelete: requestDeletePhrase
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List);

