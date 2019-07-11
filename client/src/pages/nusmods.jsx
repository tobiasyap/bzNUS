import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  Container,
  Navbar,
  NavbarBrand,
  NavLink,
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Button,
  Alert
} from "reactstrap";

class NusModsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newTimetableURL: "",
      alert: null
    };
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    onUserChange: PropTypes.func.isRequired
  };

  handleInputChange = e => {
    this.setState({ newTimetableURL: e.target.value });
  };

  handleUpdateTimetableURL = () => {
    const encodedURL = encodeURIComponent(this.state.newTimetableURL);
    const { user } = this.props;
    fetch(`/api/users/${user.user_id}/timetableurl`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({ timetableurl: encodedURL })
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            alert: {
              message: "NUSMods data synced. Note: if you change your timetable in NUSMods, you must sync again.",
              success: true
            }
          });
        } else {
          throw new Error("Failed to update timetableurl");
        }
        return res;
      })
      .then(res => res.json())
      .then(user => this.props.onUserChange(user)) // Update app User object
      .catch(err => {
        console.error(err);
        this.setState({
          alert: {
            message: "Whoops! Error syncing with NUSMods.",
            success: false
          }
        });
      });
  };

  render() {
    return (
      <div>
        <Container fluid className="Centered">
          <Row>
            <Col>
              Go to NUSMods, click on Share/Sync, copy URL and paste it here
            </Col>
          </Row>
          <InputGroup>
            <Input
              placeholder="Enter NUSMods URL"
              value={this.state.newTimetableURL}
              onChange={this.handleInputChange}
            />
            <InputGroupAddon addonType="append">
              <Button onClick={this.handleUpdateTimetableURL}>Sync</Button>
            </InputGroupAddon>
          </InputGroup>
        </Container>
        <div>
          {this.state.alert && (
            <Alert color={this.state.alert.success === true ? "success" : "danger"}>
              {this.state.alert.message}
            </Alert>
          )}
        </div>
      </div>
    );
  }
}

export default NusModsPage;
