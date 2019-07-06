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
  Button
} from "reactstrap";

import Grid from "../components/grid";
import GroupSchedule from "../components/GroupSchedule";
import MemberList from "../components/MemberList";
import TodoPane from "../components/TodoPane";

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
    group: PropTypes.object.isRequired,
    onUnmount: PropTypes.func.isRequired,
    onGroupUpdate: PropTypes.func
  };

  toggleTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
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
              To-Do
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "3" })}
              onClick={() => {
                this.toggleTab("3");
              }}
            >
              Timetable
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "4" })}
              onClick={() => {
                this.toggleTab("4");
              }}
            >
              Team
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <h4>Welcome to Group Example Home Page</h4>
              </Col>
            </Row>
            <GroupSchedule users={[]} />
          </TabPane>
          <TabPane tabId="2">
            <TodoPane
              group_id={this.props.group.group_id}
              todos={this.props.group.todos}
              onTodoUpdate={this.props.onGroupUpdate}
            />
          </TabPane>
          <TabPane tabId="3">
            <Grid />
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                <h4>Data from group api displaying member data</h4>
                <h6>View, add, remove members</h6>
                <MemberList
                  user={this.props.user}
                  group={this.props.group}
                  groupUsers={this.state.groupUsers}
                />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }

  componentDidMount() {
    let users = [];
    for (let user_id of this.props.group.user_ids) {
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
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }
}
