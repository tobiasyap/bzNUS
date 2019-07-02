import React from "react";
import PropTypes from "prop-types";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  static propTypes = {
    user: PropTypes.object.isRequired
  };
  render() {
    return (
      <Form>
        <FormGroup row>
          <Label for="formEmail" sm={2}>
            Email
          </Label>
          <Col sm={10}>
            <Input
              type="email"
              name="email"
              id="formEmail"
              placeholder={this.props.user.email}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label for="formUsername" sm={2}>
            Username
          </Label>
          <Col sm={10}>
            <Input
              type="text"
              name="username"
              id="formUsername"
              placeholder={this.props.user.username}
            />
          </Col>
        </FormGroup>
      </Form>
    );
  }
}

export default ProfilePage;
