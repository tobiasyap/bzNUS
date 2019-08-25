import React from "react";
import PropTypes from "prop-types";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import moment from "moment";

import EventCreationModal from "./EventCreationModal";

class EventPane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEventCreationModal: false
    };
  }
  static propTypes = {
    group_id: PropTypes.number.isRequired,
    events: PropTypes.array.isRequired,
    onEventUpdate: PropTypes.func.isRequired
  };

  render() {
    const EventItems = this.EventItems;
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
      </div>
    );
  }

  EventItems = props => {
    let items = [...props.events]
      .sort((a, b) => new Date(b.start_timestamp) - new Date(a.start_timestamp))
      .map(event => (
        <ListGroupItem key={`lgi_${event.event_id}`}>
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
}

export default EventPane;
