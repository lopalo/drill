import React from "react";
import {Link} from "react-router";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {isAdmin} from "../../common/selectors";
import {confirmAction} from "../../common/actions";
import {requestDeletePhrase, requestAddToMyDict} from "../actions";
import {list} from "../selectors";


const List = ({list, isAdmin, onAddToMyDict, onDelete}) => (
  <table className="table">
    <thead>
      <tr>
        <th>Source Text</th>
        <th>Target Text</th>
        <th>Added By</th>
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
          onDelete={() => onDelete(row.sourceText, row.id)} />
      )}
    </tbody>
  </table>
);


const ListItem = ({row, isAdmin, onDelete, onAddToMyDict}) => (
  <tr className={row.modified ? "warning" : ""}>
    <td>{row.sourceText}</td>
    <td>{row.targetText}</td>
    <td>{row.addedBy}</td>
    <td className="col-md-1">
      {!row.isInMyDict &&
        <button className="btn btn-default" onClick={onAddToMyDict}>
          <span className="glyphicon glyphicon-plus"></span>
        </button>
      }
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


const deletePhrase = (sourceText, id) => confirmAction(
    `Are you sure you want to delete "${sourceText}"?`,
    requestDeletePhrase(id)
);

const mapDispatchToProps = dispatch => bindActionCreators({
    onDelete: deletePhrase,
    onAddToMyDict: requestAddToMyDict,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List);

