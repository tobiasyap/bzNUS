import React from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col
} from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";

import GroupSchedule from "./GroupSchedule";
import MemberList from "./MemberList";
import TodoGrid from "./TodoGrid";

export default class Tabs extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1"
    };
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    groupUsers: PropTypes.array.isRequired
  };

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render() {
    return (
      <div>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "2" })}
              onClick={() => {
                this.toggle("2");
              }}
            >
              To-Do
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "3" })}
              onClick={() => {
                this.toggle("3");
              }}
            >
              Timetable
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "4" })}
              onClick={() => {
                this.toggle("4");
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
            
            <TodoGrid todos={this.props.group.todos} />
          </TabPane>
          <TabPane tabId="3">
          </TabPane>
          <TabPane tabId="4">
            <Row>
              <Col sm="12">
                <h4>Data from group api displaying member data</h4>
                <h6>View, add, remove members</h6>
                <MemberList
                  user={this.props.user}
                  group={this.props.group}
                  groupUsers={this.props.groupUsers}
                />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}
