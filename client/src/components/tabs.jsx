import React from "react";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  CardTitle,
  CardText,
  Row,
  Col
} from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";

import Grid from "./grid";
import GroupSchedule from "./GroupSchedule";
import MemberList from "./MemberList";

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
            <Row>
              <Col sm="6">
                <Card body>
                  <CardTitle>Complete login with OpenID</CardTitle>
                  <CardText>
                    We need to finish connecting database with NUS OpenID.
                  </CardText>
                  <Button color="info">Edit</Button>
                  <Button color="danger">Delete</Button>
                </Card>
              </Col>
              <Col sm="6">
                <Card body>
                  <CardTitle>To-do card</CardTitle>
                  <CardText>To-do task.</CardText>
                  <Button>Edit</Button>
                  <Button>Delete</Button>
                </Card>
              </Col>
            </Row>
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
