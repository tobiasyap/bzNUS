import React from "react";
import PropTypes from "prop-types";
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormFeedback
} from "reactstrap";

class UserAddForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      validate: {
        username: ""
      }
    };
  }

  static propTypes = {
    group_id: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  onSubmit = event => {
    const { group_id } = this.props;
    fetch(`/api/groups/${group_id}/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        username: this.state.username
      })
    })
    .then(res => {
      if(res.status === 200) {
        this.props.onUpdate();
      }
      else {
        if(res.body === "Specified username does not exist.") {
          const { validate } = this.state;
          validate.usernameState = "bad";
          this.setState({ validate });
          return;
        }
        throw new Error("Failed to insert user");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Unexpected error. Please try again.");
    });
  };

  handleChange = async event => {
    await this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <Form inline onSubmit={this.onSubmit}>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="formUsername" className="mr-sm-2">Add user</Label>
          <Col sm={10}>
            <Input
              type="text"
              name="username"
              id="formUsername"
              placeholder="Enter username"
              value={this.state.username}
              invalid={this.state.validate.username === "bad"}
              onChange={e => {
                const { validate } = this.state;
                validate.usernameState = ""; // Reset invalid state
                this.setState({ validate });
                this.handleChange(e);
              }}
            />
            <FormFeedback invalid>
              There isn't a user with that username.
            </FormFeedback>
          </Col>
        </FormGroup>
        <Button>Add</Button>
      </Form>
    );
  }
}
export default UserAddForm;
