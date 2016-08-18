import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import List from "./List";
import {isAdmin} from "../../common/selectors";


const Dictionary = ({children, isAdmin}) => (
  <div>
    {children}
    {isAdmin &&
      <p className="pull-right">
        <Link to="dictionary/create-phrase" className="btn btn-primary">
          Create Phrase
        </Link>
      </p>
    }
    <List />
  </div>
);


const mapStateToProps = createStructuredSelector({isAdmin});


export default connect(mapStateToProps)(Dictionary);

