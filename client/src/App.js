import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

// Pages
import HomePage from "./pages";
import NotFoundPage from "./pages/404";
import LoginPage from  "./pages/login";
import NusModsPage from "./pages/nusmods";
import GroupPage from './pages/group';

import NavBar from './components/Navbar';
import PrivateRoute from './components/privateroute';

function App() {

  const NavigationBar = withRouter(NavBar);

  return (
    <Router>
        <NavigationBar />
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/" component={HomePage} />
          <Route exact path="/404" component={NotFoundPage} />
          <Route exact path="/nusmods" component={NusModsPage} />
          <Route exact path="/group" component={GroupPage} />
          <Redirect to="/404" />
        </Switch>
    </Router>
  );
}

export default App;
