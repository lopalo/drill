import React from "react";
import {
    Router,
    Route,
    IndexRedirect,
    Link,
    useRouterHistory,
    routerShape
} from "react-router";
import {createHashHistory} from "history";
import {connect} from "react-redux";

import Auth from "./auth/containers/Auth";
import Profile from "./profile/containers/Profile";
import Training from "./training/containers/Training";
import MyDictionary from "./my-dictionary/containers/MyDictionary";
import dictionary from "./dictionary/containers/Dictionary";



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
    router: routerShape
};


class App extends React.Component {
    render() {
        return this.props.user === null ? <Auth /> : this.renderApp();
    }
    renderApp() {
        let userName = this.props.user.name;
        return (
          <div>
            <div className="navbar navbar-inverse">
              <Link to="/" className="navbar-brand">Drill</Link>
              <ul className="nav navbar-nav pull-right">
                <NavItem to="/training">Training</NavItem>
                <NavItem to="/my-dictionary">My Dictionary</NavItem>
                <NavItem to="/dictionary">Dictionary</NavItem>
                <NavItem to="/profile">
                  <span className="text text-success">{userName}</span>
                </NavItem>
              </ul>
            </div>
            {this.props.children}
          </div>
        );
    }
}

const AppContainer = connect(s => ({user: s.user}))(App);


const Root = () => {
    let history = useRouterHistory(createHashHistory)({queryKey: false});
    return (
      <Router history={history}>
        <Route path="/" component={AppContainer}>
          <IndexRedirect to="my-dictionary" />
          <Route path="training" component={Training} />
          <Route path="my-dictionary" component={MyDictionary} />
          <Route path="dictionary" component={dictionary} />
          <Route path="profile" component={Profile} />
        </Route>
      </Router>
    );
};

export default Root;


