import React from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Col,
} from 'reactstrap';

import { Link } from 'react-router-dom';

const LoginPage = () => {

    return (
        <div class="centralize-login">
            <h1>bzNUS</h1>
            <Link to="/">Login with NUSNET ID</Link>
        </div>
    );
};

export default LoginPage;