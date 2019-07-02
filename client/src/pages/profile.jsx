import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  FormFeedback
} from "reactstrap";

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.user.email || "",
      username: this.props.user.username || "",
      validate: {
        emailState: "",
        usernameState: ""
      }
    };
  }

  static propTypes = {
    user: PropTypes.object.isRequired
  };

  validateEmail = e => {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    if (emailRex.test(e.target.value)) {
      validate.emailState = "ok";
    } else {
      validate.emailState = "bad";
    }
    this.setState({ validate });
  };

  onSubmit = event => {
    const { user } = this.props;
    fetch(`/api/users/${user.user_id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        user_id: user.user_id,
        nusnet_id: user.nusnet_id,
        fullname: user.fullname,
        timetableurl: user.timetableurl,
        
        username: this.state.username === "" ? null : this.state.username,
        email: this.state.email === "" ? null : this.state.email
      })
    })
    .then(res => {
      console.log("response received:", res);
      if(res.status === 200) {
        // Update App User object
        this.props.onUserChange(res.json());
      }
      else {
        if(res.body === "Username already in use") {
          const { validate } = this.state;
          validate.usernameState = "bad";
          this.setState({ validate });
          return;
        }
        throw new Error("Failed to update object");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Unexpected error. Please try again.");
    })
  };

  handleChange = async event => {
    await this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <Form onSubmit={this.onSubmit}>
          <FormGroup row>
            <Label for="formEmail" sm={2}>
              Email
            </Label>
            <Col sm={10}>
              <Input
                type="email"
                name="email"
                id="formEmail"
                placeholder="Your email"
                value={this.state.email}
                valid={this.state.validate.emailState === "ok"}
                invalid={this.state.validate.emailState === "bad"}
                onChange={e => {
                  this.validateEmail(e);
                  this.handleChange(e);
                }}
              />
              <FormFeedback invalid>
                That doesn't look like a valid email.
              </FormFeedback>
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
                placeholder={"Enter a username so your groupmates can add you"}
                value={this.state.username}
                invalid={this.state.validate.usernameState === "bad"}
                onChange={e => {
                  const { validate } = this.state;
                  validate.usernameState = ""; // Reset invalid state
                  this.setState({ validate });
                  this.handleChange(e);
                }}
              />
              <FormFeedback invalid>
                Username already in use.
              </FormFeedback>
            </Col>
          </FormGroup>
          <Button>Save</Button>
        </Form>
        <Button tag={Link} to="/nusmods">
          Sync with NUSMods
        </Button>
      </div>
    );
  }
}

export default ProfilePage;
