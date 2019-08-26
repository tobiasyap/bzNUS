import React from "react";
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner
} from "reactstrap";
import PropTypes from "prop-types";
import RichTextEditor from "react-rte";

import StartEndPicker from "./StartEndPicker";

class EventEditModal extends React.Component {
  constructor(props) {
    super(props);

    const { event } = this.props;
    const value = event.minutes
      ? RichTextEditor.createValueFromString(event.minutes, "html")
      : RichTextEditor.createEmptyValue();
    this.state = {
      title: event.title,
      description: event.description,
      minutesValue: value,
      start_date: new Date(event.start_timestamp),
      end_date: new Date(event.end_timestamp),
      loading: false
    };
  }

  static propTypes = {
    event: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
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
          <ModalHeader toggle={this.props.onToggle}>Edit event</ModalHeader>
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
            <Label>Minutes</Label>
            <RichTextEditor
              value={this.state.minutesValue}
              onChange={value => this.setState({ minutesValue: value })}
            />
            <StartEndPicker
              start_date={this.state.start_date}
              end_date={this.state.end_date}
              onStartUpdate={date => this.setState({ start_date: date })}
              onEndUpdate={date => this.setState({ end_date: date })}
            />
          </ModalBody>
          <ModalFooter>
            {this.state.loading && <Spinner size="sm" color="primary" />}
            <Button color="primary" onClick={this.onSubmit}>
              Save
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
      await fetch(`/api/events/${this.props.event.event_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          event_id: this.props.event.event_id,
          title: this.state.title,
          description: this.state.description,
          minutes: this.state.minutesValue.toString("html"),
          start_timestamp: this.state.start_date.toISOString(),
          end_timestamp: this.state.end_date.toISOString()
        })
      });
      this.props.onUpdate(); // update group state
    } catch (err) {
      console.error(`Error updating event '${this.state.title}'`);
      console.error(err);
      alert("Unexpected error. Please try again.");
    }
    this.setState({ loading: false });
    this.props.onToggle();
  };
}

export default EventEditModal;
