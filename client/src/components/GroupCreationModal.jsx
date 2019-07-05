import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner
} from "reactstrap";
import PropTypes from "prop-types";

class GroupCreationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      loading: false
    };
  }

  static propTypes = {
    user_id: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired
  };

  toggle = () => {
    this.props.onToggle();
  };

  handleInputChange = async event => {
    await this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Create a group</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="formName">Group name</Label>
                <Input
                  type="text"
                  name="name"
                  id="formName"
                  placeholder="Enter group name"
                  value={this.state.name}
                  onChange={e => this.handleInputChange(e)}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            {this.state.loading &&
              <Spinner size="sm" color="primary" />
            }
            <Button color="primary" onClick={this.onSubmit}>
              Create
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  onSubmit = () => {
    this.setState({ loading: true });
    try {
      fetch("/api/groups", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          name: this.state.name,
          user_ids: [this.props.user_id]
        })
      });
    }
    finally {
      this.setState({ loading: false });
    }
    this.toggle();
  };
}

export default GroupCreationModal;
