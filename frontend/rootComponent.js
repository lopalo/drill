import React from "react";
import {
    Router,
    Route,
    IndexRedirect,
    Link,
    routerShape
} from "react-router";
import {connect} from "react-redux";

import Auth from "./auth/components/Auth";
import Logout from "./auth/components/Logout";
import Profile from "./profile/components/Profile";
import Training from "./training/components/Training";
import MyDictionary from "./my-dictionary/components/MyDictionary";
import dictionaryRoutes from "./dictionary/components/Routes";



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


class AppComponent extends React.Component {
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
                <li className="nav-item"><Logout /></li>
              </ul>
            </div>
            {this.props.children}
          </div>
        );
    }
}

const App = connect(s => ({user: s.user}))(AppComponent);


export default ({history}) => (
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRedirect to="my-dictionary" />
      <Route path="training" component={Training} />
      <Route path="my-dictionary" component={MyDictionary} />
      {dictionaryRoutes()}
      <Route path="profile" component={Profile} />
    </Route>
  </Router>
);



