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
        <Container fluid className="Centered">
            <Row>
                <Col>Welcome to bzNUS</Col>
            </Row>
            <Link to="/login">Login</Link>
            <div></div>
            <Link to="/nusmods">Link to NUSMods</Link>
            <div></div>
            <Link to="/home">Link to demo Home Page</Link>
        </Container>
        </div>
    );
};

export default MainPage;