import React from 'react';
import PropTypes from "prop-types";


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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      error: null,
      authenticated: false
    };
  }

  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string,
      fullname: PropTypes.string,
      email: PropTypes.string,
      timtableurl: PropTypes.string,
      user_id: PropTypes.number,
      nusnet_id: PropTypes.string,
      group_ids: PropTypes.array
    })
  };

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'
    fetch("http://localhost:5000/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(response => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then(responseJson => {
        this.setState({
          authenticated: true,
          user: responseJson.user
        });
      })
      .catch(error => {
        this.setState({
          authenticated: false,
          error: "Failed to authenticate user"
        });
      });
  }

  render() {
    const NavigationBar = withRouter(NavBar);
    const { authenticated } = this.state;

    return (
      <Router>
          <NavigationBar />
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            {!authenticated ? (
              <Redirect to="/login" />
            ) : (
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/404" component={NotFoundPage} />
                <Route exact path="/nusmods" component={NusModsPage} />
                <Route exact path="/group" component={GroupPage} />
              </Switch>
            )}
            
            <Redirect to="/404" />
          </Switch>
      </Router>
    );
  }
  
  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false });
  };
}

export default App;
