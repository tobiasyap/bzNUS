import React from "react";
import PropTypes from "prop-types";

import Tabs from "../components/tabs";

export default class GroupPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupUsers: []
    };
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    group: PropTypes.object.isRequired,
    onUnmount: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        <Tabs
          user={this.props.user}
          group={this.props.group}
          groupUsers={this.state.groupUsers}
        />
      </div>
    );
  }

  componentDidMount() {
    let users = [];
    for (let user_id of this.props.group.user_ids) {
      console.log("fetching user", user_id);
      users.push(
        fetch(`/api/users/${user_id}`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
          }
        })
          .then(res => res.json())
          .catch(err => {
            console.error(`Error fetching user ${user_id}`);
          })
      );
    }
    Promise.all(users)
      .then(users => this.setState({ groupUsers: users }))
      .catch(err => {
        alert("Error fetching group members", err);
      });
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }
}
