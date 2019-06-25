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
        <div>
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">bzNUS</NavbarBrand>
            </Navbar>
        <Container fluid className="Centered">
            <Row>
                <Col>Welcome to bzNUS</Col>
            </Row>
            <Link to="/login">Login</Link>
            <div></div>
            <Link to="/register">Register</Link>
            <div></div>
            <Link to="/nusmods">Link to NUSMods</Link>
            <div></div>
            <Link to="/example">Link to Example</Link>
        </Container>
        </div>
    );
};

export default MainPage;