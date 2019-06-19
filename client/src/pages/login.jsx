import React from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Col,
} from 'reactstrap';

//import { Link } from 'react-router-dom';

const LoginPage = () => {

    return (
        <Container fluid className="Centered">
            <Navbar dark color="dark">
                <NavbarBrand href="/">bzNUS</NavbarBrand>
            </Navbar>
            <Row>
                <Col>This is the login page</Col>
            </Row>
        </Container>
    );
};

export default LoginPage;