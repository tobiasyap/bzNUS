import React from 'react';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect
} from 'react-router-dom';

// Pages
import MainPage from "./pages";
import NotFoundPage from "./pages/404";
import LoginPage from  "./pages/login";
import RegisterPage from "./pages/register";
import NusModsPage from "./pages/nusmods";
import Example from "./pages/example";

function App() {

  return (
    <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/404" component={NotFoundPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/nusmods" component={NusModsPage} />
          <Route exact path="/example" component={Example} />
          <Redirect to="/404" />
        </Switch>
    </Router>
  );
}

export default App;
