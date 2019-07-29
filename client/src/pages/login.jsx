import React, { Component } from "react";

import { Button } from "reactstrap";

export default class LoginPage extends Component {
  render() {
    return (
      <div class="centralize-login">
        <h1>bzNUS</h1>
        <Button color="primary" onClick={this._handleSignInClick}>
          Login with NUSNET
        </Button>
      </div>
    );
  }

  _handleSignInClick = () => {
    // Authenticate via passport API in the backend
    // Open NUS OpenID login page
    // Upon successful login, a cookie session will be stored in the client
    window.open(
      process.env.NODE_ENV === "production"
        ? "/auth/nus"
        : "http://localhost:5000/auth/nus",
      "_self"
    );
  };
}
