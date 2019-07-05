import React from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";

import { ButtonGroup, Button, ListGroup, ListGroupItem } from "reactstrap";

// Pages
import HomePage from "./pages";
import NotFoundPage from "./pages/404";
import LoginPage from "./pages/login";
import NusModsPage from "./pages/nusmods";
import GroupPage from "./pages/group";
import ProfilePage from "./pages/profile";

import SideBar from "./components/SideBar";
import NavBar from "./components/Navbar";
import PrivateRoute from "./components/privateroute";
import GroupCreationModal from "./components/GroupCreationModal";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      groups: [],
      selectedGroupID: -1,
      error: null,
      authenticated: false,
      loaded: false, // only render after authentication is complete
      showSidebar: true,
      showGroupCreationModal: false
    };
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
    this.fetchAuthenticatedUser().then(() => {
      this.fetchGroups();
    });
  }

  render() {
    const NavigationBar = withRouter(NavBar);
    const AutoSideBar = withRouter(SideBar);
    const ListGroupButtons = this.ListGroupButtons;

    const { authenticated, loaded } = this.state;
    const { location } = this.props;

    if (!loaded) return null;
    return (
      <Router>
        <AutoSideBar
          sidebar={
            <div>
              <ListGroup>
                <ListGroupItem
                  tag="button"
                  onClick={this.onGroupCreationButtonClick}
                >
                  Create a group
                </ListGroupItem>
                <ListGroupButtons />
              </ListGroup>
            </div>
          }
        >
          <NavigationBar />
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <PrivateRoute
              authed={authenticated}
              exact
              path="/"
              component={HomePage}
            />
            <PrivateRoute
              authed={authenticated}
              exact
              path="/404"
              component={NotFoundPage}
            />
            <PrivateRoute
              authed={authenticated}
              exact
              path="/nusmods"
              component={NusModsPage}
              user={this.state.user}
              onUserChange={this.onUserChange}
            />
            <PrivateRoute
              authed={authenticated}
              exact
              path="/group"
              component={GroupPage}
              onUnmount={this.onGroupPageUnmount}
            />
            <PrivateRoute
              authed={authenticated}
              exact
              path="/profile"
              component={ProfilePage}
              user={this.state.user}
              onUserChange={this.onUserChange}
            />
            <Redirect to="/404" />
          </Switch>
          <GroupCreationModal
            isOpen={this.state.showGroupCreationModal}
            onToggle={this.onGroupCreationToggle}
            user_id={this.state.user.user_id}
          />
        </AutoSideBar>
      </Router>
    );
  }

  ListGroupButtons = props => {
    let groupButtons = [];
    console.log(this.state.groups);
    for (const group of this.state.groups) {
      groupButtons.push(
        <ListGroupItem
          key={`lgi_${group.group_id}`}
          tag="button"
          onClick={() => {
            this.setState({ selectedGroupID: group.group_id });
          }}
          active={this.state.selectedGroupID === group.group_id}
        >
          {group.name}
        </ListGroupItem>
      );
    }
    return groupButtons;
  };

  onUserChange = user => {
    this.fetchAuthenticatedUser();
  };

  onGroupPageUnmount = () => {
    // Reset sidebar group radio buttons
    this.setState({ selectedGroupID: -1 });
  };

  onGroupCreationButtonClick = () => {
    this.setState({ showGroupCreationModal: true });
  };

  onGroupCreationToggle = () => {
    const { showGroupCreationModal } = this.state;
    this.setState({ showGroupCreationModal: !showGroupCreationModal });
  };

  fetchAuthenticatedUser = () => {
    // Fetch does not send cookies. So you should add credentials: 'include'
    return fetch("http://localhost:5000/auth/login/success", {
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
        throw new Error("Failed to authenticate user");
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
  };

  fetchGroups = () => {
    console.log(this.state.user.group_ids);
    if (!this.state.user.group_ids) {
      this.setState({ groups: [] });
      return;
    }
    let groups = [];
    console.log(this.state.user.group_ids);
    for (let group_id of this.state.user.group_ids) {
      console.log("fetching: ", group_id);
      groups.push(
        fetch(`/api/groups/${group_id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          }
        })
          .then(res => res.json())
          .catch(err => {
            console.error(`Error fetching group ${group_id}`);
          })
      );
    }
    Promise.all(groups).then(groups => {
      this.setState({ groups: groups });
    });
  };
}

export default App;
