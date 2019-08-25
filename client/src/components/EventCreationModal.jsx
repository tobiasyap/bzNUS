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
import { async } from "../../../../../../../../AppData/Local/Microsoft/TypeScript/3.5/node_modules/rxjs/internal/scheduler/async";

class EventCreationModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      description: "",
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
      
    }
    catch(err) {

    }

    this.setState({ loading: false });
    this.props.onToggle();
  };
}

export default EventCreationModal;
