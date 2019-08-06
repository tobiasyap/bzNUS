import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

import { Jumbotron, Alert } from "reactstrap";

export default class HomePage extends React.Component {

  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string,
      fullname: PropTypes.string,
      email: PropTypes.string,
      timetableurl: PropTypes.string,
      user_id: PropTypes.number.isRequired,
      nusnet_id: PropTypes.string,
      group_ids: PropTypes.array
    }).isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <Jumbotron>
          <h1 className="display-3">Welcome,</h1>
          <p className="lead">{user.fullname}</p>
          <hr className="my-2" />
          {user.username ? (
            <Alert color="success">
              Your username is {user.username}
            </Alert>
          ) : (
            <Alert color="warning">
              <Link to="/profile">Set a username so your groupmates can add you to groups.</Link>
            </Alert>
          )}
          {user.timetableurl ? (
            <Alert color="success">
              You have imported your NUSMods timetable.
            </Alert>
          ) : (
            <Alert color="warning">
              <Link to="/nusmods">Import your NUSMods timetable to get started.</Link>
            </Alert>
          )}
          {user.group_ids.length === 0 && (
            <Alert color="info">
              You aren't in any groups yet. Create one or ask your groupmates to add you.
            </Alert>
          )}
        </Jumbotron>
      </div>
    );
  }
}