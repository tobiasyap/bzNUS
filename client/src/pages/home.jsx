import React from 'react';

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <h1 class="centralize-login">Welcome to bzNUS! Create a group to start</h1>
      </div>
    );
  }
}