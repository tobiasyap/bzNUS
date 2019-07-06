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

class TodoCreationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      loading: false
    };
  }

  static propTypes = {
    group_id: PropTypes.number.isRequired,
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
          <ModalHeader toggle={this.toggle}>Create a todo</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="formTitle">Title</Label>
                <Input
                  type="text"
                  name="title"
                  id="formTitle"
                  placeholder="Enter todo title"
                  value={this.state.title}
                  onChange={e => this.handleInputChange(e)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="formDescription">Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="formDescription"
                  placeholder="Enter todo description"
                  value={this.state.description}
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
      fetch(`/api/groups/${this.props.group_id}/todos`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          title: this.state.title,
          description: this.state.description
        })
      });
      this.props.onCreate(); // Update group state
    }
    finally {
      this.setState({ loading: false });
    }
    this.toggle();
  };
}

export default TodoCreationModal;
