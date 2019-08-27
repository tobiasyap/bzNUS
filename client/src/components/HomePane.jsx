import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Badge } from "reactstrap";

import GroupTimeline from "./GroupTimeline";
import EventEditModal from "./EventEditModal";

class HomePane extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEventEditModal: false,
      selectedEventId: -1
    };
  }
  static propTypes = {
    group: PropTypes.object.isRequired,
    users: PropTypes.array.isRequired,
    onEventUpdate: PropTypes.func,
  };

  render() {
    const { group, users } = this.props;
    const selectedEvent =
      this.state.selectedEventId === -1
        ? null
        : group.events.find(
            e => e.event_id === this.state.selectedEventId
          );

    return (
      <div>
        <Row>
          <Col sm="12">
            <h3>
              Welcome to the <Badge color="secondary">{group.name}</Badge> Home
              Page
            </h3>
          </Col>
        </Row>
        <GroupTimeline
          users={users}
          events={group.events}
          onEventClick={this.onEventClick}
        />
        {selectedEvent && (
          <EventEditModal
            event={selectedEvent}
            isOpen={this.state.showEventEditModal}
            onToggle={this.onEventEditToggle}
            onUpdate={this.props.onEventUpdate}
            onDelete={this.onEventDelete}
          />
        )}
      </div>
    );
  }

  onEventClick = async event_id => {
    await this.setState({ selectedEventId: event_id });
    this.setState({ showEventEditModal: true });
  };

  onEventEditToggle = () => {
    const { showEventEditModal } = this.state;
    this.setState({ showEventEditModal: !showEventEditModal });
  };

  onEventDelete = () => {
    this.setState({ showEventEditModal: false });
    this.props.onEventUpdate();
  }
}

export default HomePane;
