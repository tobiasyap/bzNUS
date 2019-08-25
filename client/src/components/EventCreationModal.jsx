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

import StartEndPicker from "./StartEndPicker";

class EventCreationModal extends React.Component {
  constructor(props) {
    super(props);

    let start = new Date();
    start.setHours(start.getHours() + 1);
    start.setMinutes(0);
    start.setSeconds(0);
    start.setMilliseconds(0);
    let end = new Date(start);
    end.setHours(start.getHours() + 1);
    this.state = {
      title: "",
      description: "",
      start_date: start, 
      end_date: end,
      loading: false,
    };
  }

  static propTypes = {
    group_id: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired
  };

  handleInputChange = async event => {
    await this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.isOpen} toggle={this.props.onToggle}>
          <ModalHeader toggle={this.props.onToggle}>Create an event</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="formTitle">Title</Label>
                <Input
                  type="text"
                  name="title"
                  id="formTitle"
                  placeholder="Enter event title"
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
                  placeholder="Enter event description"
                  value={this.state.description}
                  onChange={e => this.handleInputChange(e)}
                />
              </FormGroup>
            </Form>
            <StartEndPicker
              start_date={this.state.start_date}
              end_date={this.state.end_date}
              onStartUpdate={date => this.setState({ start_date: date })}
              onEndUpdate={date => this.setState({ end_date: date })}
            />
          </ModalBody>
          <ModalFooter>
            {this.state.loading &&
              <Spinner size="sm" color="primary" />
            }
            <Button color="primary" onClick={this.onSubmit}>
              Create
            </Button>{" "}
            <Button color="secondary" onClick={this.props.onToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  onSubmit = async () => {
    this.setState({ loading: true });
    try {
      await fetch(`/api/groups/${this.props.group_id}/events`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          title: this.state.title,
          description: this.state.description,
          start_timestamp: this.state.start_date.toISOString(),
          end_timestamp: this.state.end_date.toISOString(),
        })
      });
      this.props.onCreate(); // update group state
    }
    catch(err) {
      console.error(`Error inserting event '${this.state.title}'`);
      console.error(err);
      alert("Unexpected error. Please try again.");
    }
    this.setState({ loading: false });
    this.props.onToggle();
  };
}

export default EventCreationModal;
