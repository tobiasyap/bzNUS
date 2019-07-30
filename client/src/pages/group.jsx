import React from "react";
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

import DemoTimeline from "../components/DemoTimeline";
import GroupTimeline from "../components/GroupTimeline";
import MemberList from "../components/MemberList";
import TodoPane from "../components/TodoPane";
import UserAddForm from "../components/UserAddForm";

export default class GroupPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupUsers: [],
      activeTab: "1"
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
              Todo
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "3" })}
              onClick={() => {
                this.toggleTab("3");
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
                <h3>Welcome to the <Badge color="secondary">{group.name}</Badge> Home Page</h3>
              </Col>
            </Row>
            <GroupTimeline users={this.state.groupUsers} />
          </TabPane>
          <TabPane tabId="2">
            <TodoPane
              group_id={group.group_id}
              todos={group.todos}
              onTodoUpdate={() => this.props.onGroupUpdate(group.group_id)}
            />
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                <h6>View, add, and remove members</h6>
                <UserAddForm
                  group_id={group.group_id}
                  onUpdate={() => this.props.onGroupUpdate(group.group_id)}
                />
                <MemberList
                  user={this.props.user}
                  group={group}
                  groupUsers={this.state.groupUsers}
                />
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
    Promise.all(users)
      .then(users => this.setState({ groupUsers: users }))
      .catch(err => {
        alert("Error fetching group members", err);
      });
  };

  componentDidMount() {
    this.fetchAndUpdateGroupUsers();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.groups !== prevProps.groups ||
      this.props.match.params.groupid !== prevProps.match.params.groupid
    ) {
      this.fetchAndUpdateGroupUsers();
    }
  }
}
