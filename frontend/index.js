import React from "react";
import {render} from "react-dom";
import {Router, Route, IndexRedirect, Link} from "react-router";
import {useRouterHistory} from "react-router";
import {createHashHistory} from "history";

import Training from "./components/training";
import MyDictionary from "./components/my-dictionary";
import dictionary from "./components/dictionary";
import Profile from "./components/profile";



const NavItem = ({to, children}, context) => {
    let isActive = context.router.isActive(to, true);
    let className = "nav-item " + (isActive ? "active" : "");
    return (
      <li className={className}>
        <Link to={to}>
          {children}
        </Link>
      </li>
    );
};

NavItem.contextTypes = {
    router: React.PropTypes.object
};


const App = ({children}) =>
    <div>
      <div className="navbar navbar-default">
        <Link to="/" className="navbar-brand">Drill</Link>
        <ul className="nav navbar-nav pull-right">
          <NavItem to="/training">Training</NavItem>
          <NavItem to="/my-dictionary">My Dictionary</NavItem>
          <NavItem to="/dictionary">Dictionary</NavItem>
          <NavItem to="/profile">Profile</NavItem>
        </ul>
      </div>
      {children}
    </div>;


function Root() {
    let history = useRouterHistory(createHashHistory)({queryKey: false});
    return (
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRedirect to="my-dictionary" />
          <Route path="training" component={Training} />
          <Route path="my-dictionary" component={MyDictionary} />
          <Route path="dictionary" component={dictionary} />
          <Route path="profile" component={Profile} />
        </Route>
      </Router>
    );
}


render(
    <Root />,
    document.getElementById("app")
);
