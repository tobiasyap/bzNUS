import React from "react";
import PropTypes from "prop-types";
import { ListGroup, ListGroupItem } from "reactstrap";

class MemberList extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    groupUsers: PropTypes.array.isRequired
  };

  render() {
    const MemberItems = this.MemberItems;
    return (
      <ListGroup>
        <MemberItems groupUsers={this.props.groupUsers}/>
      </ListGroup>
    );
  }

  MemberItems = (props) => {
    let items = [];
    for(const user of this.props.groupUsers) {
      items.push(
        <ListGroupItem key={`lgi_${user.user_id}`}>
          {user.username}
        </ListGroupItem>
      );
    }
    return items;
  }
}

export default MemberList;
