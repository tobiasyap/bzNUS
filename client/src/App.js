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
import ProfilePage from "./pages/profile";

import NavBar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      error: null,
      authenticated: false,
      loaded: false // only render after authentication is complete
    };
    console.log('in constructor');
  }

  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string,
      fullname: PropTypes.string,
      email: PropTypes.string,
      timetableurl: PropTypes.string,
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
      })
      .finally(() => {
        this.setState({ loaded: true });
      });
  }

  render() {
    const NavigationBar = withRouter(NavBar);
    const auth = this.state.authenticated;

    if(!this.state.loaded) return null;
    return (
      <Router>
          <NavigationBar />
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <PrivateRoute authed={auth} exact path="/" component={HomePage} />
            <PrivateRoute authed={auth} exact path="/404" component={NotFoundPage} />
            <PrivateRoute authed={auth} exact path="/nusmods" 
              component={NusModsPage} user={this.state.user} onUserChange = {this.onUserChange}
            />
            <PrivateRoute authed={auth} exact path="/group" component={GroupPage} />
            <PrivateRoute authed={auth} exact path="/profile" component={ProfilePage}
              user={this.state.user} 
            />
            <Redirect to="/404" />
          </Switch>
      </Router>
    );
  }
  
  onUserChange = (user) => {
    this.setState({ user: user });
  }
}

export default App;
