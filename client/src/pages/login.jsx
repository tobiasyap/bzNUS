import React, { Component } from "react";
import PropTypes from "prop-types";

import {
    Button
} from 'reactstrap';

export default class LoginPage extends Component {

    render() {
        return (
            <div class="centralize-login">
                <h1>bzNUS</h1>
                <Button color="warning" onClick={this._handleSignInClick}>Login with NUS OpenID</Button>
            </div>
        );
    }

    _handleSignInClick = () => {
        // Authenticate using via passport api in the backend
        // Open NUS OpenID login page
        // Upon successful login, a cookie session will be stored in the client
        window.open("http://localhost:5000/auth/nus", "_self");
      };
};