import React from "react";
import {Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {isAdmin} from "../../common/selectors";
import {
    requestList,
    requestDeletePhrase,
    requestAddToMyDict
} from "../actions";
import {list} from "../selectors";


class List extends React.Component {
    componentDidMount() {
        this.props.onDidMount();
    }
    render() {
        let {list, isAdmin, onAddToMyDict, onDelete} = this.props;
        return (
          <table className="table">
            <thead>
              <tr>
                <th>Source Text</th>
                <th>Target Text</th>
                <th>Source Lang</th>
                <th>Target Lang</th>
                <th>Add To My Dictionary</th>
                {isAdmin && <th>Edit</th>}
                {isAdmin && <th>Delete</th>}
              </tr>
            </thead>
            <tbody>
              {list.map(row =>
                <ListItem
                  key={row.id}
                  row={row}
                  isAdmin={isAdmin}
                  onAddToMyDict={() => onAddToMyDict(row.id)}
                  onDelete={() => onDelete(row.id)} />
              )}
            </tbody>
          </table>
        );
    }
}


const ListItem = ({row, isAdmin, onDelete, onAddToMyDict}) => (
  <tr>
    <td>{row.sourceText}</td>
    <td>{row.targetText}</td>
    <td>{row.sourceLang}</td>
    <td>{row.targetLang}</td>
    <td>
      <button className="btn btn-default" onClick={onAddToMyDict}>
        <span className="glyphicon glyphicon-plus"></span>
      </button>
    </td>
    {isAdmin &&
      <td>
       <Link to={`dictionary/edit/${row.id}`} className="btn btn-default">
         <span className="glyphicon glyphicon-edit"></span>
       </Link>
      </td>
    }
    {isAdmin &&
      <td>
       <button className="btn btn-default" onClick={onDelete}>
        <span className="glyphicon glyphicon-trash"></span>
       </button>
      </td>
    }
  </tr>
);


const mapStateToProps = createStructuredSelector({list, isAdmin});

const mapDispatchToProps = dispatch => bindActionCreators({
    onDidMount: requestList,
    onDelete: requestDeletePhrase,
    onAddToMyDict: requestAddToMyDict,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List);

