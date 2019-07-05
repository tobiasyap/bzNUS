import React from 'react';
import PropTypes from "prop-types";

import Tabs from '../components/tabs';

export default class GroupPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  static propTypes = {
    user: PropTypes.object.isRequired,
    groupID: PropTypes.object.isRequired,
    onUnmount: PropTypes.func.isRequired
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    return (
      <div>
        <Tabs user={this.props.user} groupID={this.props.user}/>
      </div>
    );
  }

  componentWillUnmount() {
    this.props.onUnmount();
  }
}
