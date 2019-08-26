import React from "react";
import { Redirect } from "react-router-dom";
import classnames from "classnames";
import PropTypes from "prop-types";

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Button,
  Badge
} from "reactstrap";

import GroupTimeline from "../components/GroupTimeline";
import EventPane from "../components/EventPane";
import TodoPane from "../components/TodoPane";
import MemberList from "../components/MemberList";
import UserAddForm from "../components/UserAddForm";

export default class GroupPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupUsers: [],
      activeTab: "1",
      redirect: false
    };
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    groups: PropTypes.array.isRequired,
    onGroupUpdate: PropTypes.func,
    match: PropTypes.object.isRequired
  };

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    const group = this.getGroup();

    if (!group || !this.userIn(group)) {
      return <p>You are not authorised to view this group.</p>;
    }

    if(this.state.redirect) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "1" })}
              onClick={() => {
                this.toggleTab("1");
              }}
            >
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "2" })}
              onClick={() => {
                this.toggleTab("2");
              }}
            >
              Events
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "3" })}
              onClick={() => {
                this.toggleTab("3");
              }}
            >
              Todo
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "4" })}
              onClick={() => {
                this.toggleTab("4");
              }}
            >
              Members
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <h3>
                  Welcome to the <Badge color="secondary">{group.name}</Badge>{" "}
                  Home Page
                </h3>
              </Col>
            </Row>
            <GroupTimeline 
              users={this.state.groupUsers}
              events={group.events} 
            />
          </TabPane>
          <TabPane tabId="2">
            <EventPane
              group_id={group.group_id}
              events={group.events}
              onEventUpdate={() => this.props.onGroupUpdate(group.group_id)}
            />
          </TabPane>
          <TabPane tabId="3">
            <TodoPane
              group_id={group.group_id}
              todos={group.todos}
              onTodoUpdate={() => this.props.onGroupUpdate(group.group_id)}
            />
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                <h6>View, add, and remove members</h6>
                <UserAddForm
                  group_id={group.group_id}
                  onUpdate={() => this.props.onGroupUpdate(group.group_id)}
                />
                <br />
                <MemberList
                  user={this.props.user}
                  group={group}
                  groupUsers={this.state.groupUsers}
                />
                <br />
                <Button
                  outline
                  color="danger"
                  onClick={() => this.leaveGroup(group.group_id)}
                >
                  Leave group
                </Button>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }

  getGroup = () => {
    return this.props.groups.find(
      g => g.group_id === Number(this.props.match.params.groupid)
    );
  };

  userIn = group => {
    return group.user_ids.includes(this.props.user.user_id);
  };

  fetchAndUpdateGroupUsers = () => {
    // Derive group from URL parameter
    const group = this.getGroup();
    if (!group || !this.userIn(group)) {
      return;
    }

    let users = [];
    for (let user_id of group.user_ids) {
      console.log("fetching user", user_id);
      users.push(
        fetch(`/api/users/${user_id}`, {
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
            console.error(`Error fetching user ${user_id}`);
          })
      );
    }
    return Promise.all(users)
      .then(users => this.setState({ groupUsers: users }))
      .catch(err => {
        alert("Error fetching group members", err);
      });
  };

  componentDidMount() {
    this.fetchAndUpdateGroupUsers();
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      this.props.groups !== prevProps.groups ||
      this.props.match.params.groupid !== prevProps.match.params.groupid
    ) {
      await this.fetchAndUpdateGroupUsers();
      this.setState({ activeTab: prevState.activeTab });
    }
  }

  leaveGroup = group_id => {
    fetch(`/api/groups/${group_id}/users/${this.props.user.user_id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
    .then(res => {
      if(res.status === 500) throw new Error(res.status + res.statusText);
      return res;
    })
    .then(res => {
      this.setState({ redirect: true });
      this.props.onGroupUpdate(group_id);
    })
    .catch(err => {
      alert("Error leaving group", err);
    });
  };
}
