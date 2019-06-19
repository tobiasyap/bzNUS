import React from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Col,
} from 'reactstrap';

import { Link } from 'react-router-dom';

const MainPage = () => {

    return (
        <Container fluid className="Centered">
            <Navbar dark color="dark">
                <NavbarBrand href="/">bzNUS</NavbarBrand>
            </Navbar>
            <Row>
                <Col>Welcome to bzNUS</Col>
            </Row>
            <Link to="/login">Login</Link>
            <div></div>
            <Link to="/register">Register</Link>
        </Container>
    );
};

export default MainPage;