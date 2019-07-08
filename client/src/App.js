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
      this.fetchGroups().then(() => this.setState({ loaded: true }));
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
                <ListGroupButtons groups={this.state.groups} />
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
              path="/group/:groupid"
              component={GroupPage}
              user={this.state.user}
              groups={this.state.groups}
              onGroupUpdate={this.onGroupUpdate}
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
            onCreation={() => {
              this.fetchAuthenticatedUser()
              .then(() => this.fetchGroups());
            }}
          />
        </AutoSideBar>
      </Router>
    );
  }

  ListGroupButtons = props => {
    let groupButtons = [];
    for (const group of props.groups) {
      groupButtons.push(
        <ListGroupItem
          key={`lgi_${group.group_id}`}
          tag={Link}
          exact
          to={`/group/${group.group_id}`}
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
    // TODO: reset sidebar group radio buttons
  };

  onGroupUpdate = group_id => {
    fetch(`/api/groups/${group_id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(res => {
        if (
          res.status === 404 ||
          !res.json().user_ids.includes(this.state.user.user_id)
        ) {
          // Remove removed group
          let { groups } = this.state;
          groups = groups.filter(g => g.group_id !== group_id);
          this.setState({ groups });
          this.fetchAuthenticatedUser(); // Update user group_ids
          throw Error("Group no longer exists / User no longer in group");
        }
      })
      .then(res => res.json())
      .then(group => {
        let { groups } = this.state;
        const index = groups.findIndex(g => g.group_id === group_id);
        groups[index] = group;
        this.setState({ groups });
      })
      .catch(err => {
        console.error(`Error fetching group ${group_id}`);
        console.error(err);
      });
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
      });
  };

  fetchGroups = () => {
    if (!this.state.user.group_ids) {
      this.setState({ groups: [] });
      return new Promise((res, rej) => res("No groups"));
    }
    let groups = [];
    for (let group_id of this.state.user.group_ids) {
      console.log("fetching group", group_id);
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
    return Promise.all(groups).then(groups => {
      this.setState({ groups: groups });
    });
  };
}

export default App;
