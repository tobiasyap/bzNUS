import React from "react";
import PropTypes from "prop-types";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import moment from "moment";

import EventCreationModal from "./EventCreationModal";
import EventEditModal from "./EventEditModal";

class EventPane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedEventId: -1,
      showEventCreationModal: false,
      showEventEditModal: false
    };
  }
  static propTypes = {
    group_id: PropTypes.number.isRequired,
    events: PropTypes.array.isRequired,
    onEventUpdate: PropTypes.func.isRequired
  };

  render() {
    const EventItems = this.EventItems;
    const selectedEvent =
      this.state.selectedEventId === -1
        ? null
        : this.props.events.find(
            e => e.event_id === this.state.selectedEventId
          );

    return (
      <div>
        <Button color="primary" onClick={this.onEventCreationButtonClick}>
          Create
        </Button>
        <br />
        {this.props.events.length > 0 ? (
          <ListGroup>
            <EventItems events={this.props.events} />
          </ListGroup>
        ) : (
          <p>No events yet.</p>
        )}
        <EventCreationModal
          group_id={this.props.group_id}
          isOpen={this.state.showEventCreationModal}
          onToggle={this.onEventCreationToggle}
          onCreate={this.props.onEventUpdate}
        />
        {selectedEvent && (
          <EventEditModal
            event={selectedEvent}
            isOpen={this.state.showEventEditModal}
            onToggle={this.onEventEditToggle}
            onUpdate={this.props.onEventUpdate}
          />
        )}
      </div>
    );
  }

  EventItems = props => {
    let items = [...props.events]
      .sort((a, b) => new Date(b.start_timestamp) - new Date(a.start_timestamp))
      .map(event => (
        <ListGroupItem
          key={`lgi_${event.event_id}`}
          tag="button"
          action
          onClick={() => this.onEventClick(event.event_id)}
        >
          {moment(event.start_timestamp).format("DD/MM/YY h:mma")} {event.title}
        </ListGroupItem>
      ));
    return items;
  };

  onEventCreationButtonClick = () => {
    this.setState({ showEventCreationModal: true });
  };

  onEventCreationToggle = () => {
    const { showEventCreationModal } = this.state;
    this.setState({ showEventCreationModal: !showEventCreationModal });
  };

  onEventClick = async event_id => {
    await this.setState({ selectedEventId: event_id });
    this.setState({ showEventEditModal: true });
  };

  onEventEditToggle = () => {
    const { showEventEditModal } = this.state;
    this.setState({ showEventEditModal: !showEventEditModal });
  };
}

export default EventPane;
