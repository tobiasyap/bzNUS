import React from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  NavLink,
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  Button
} from 'reactstrap';

import { Link } from 'react-router-dom';

const NusModsPage = () => {

    return (
        <Container fluid className="Centered">
            <Row>
                <Col>Go to NUSMods, click on share/sync, copy link url, encode url</Col>
            </Row>
            <InputGroup>
            <Input placeholder="Enter encoded URL"/>
                <InputGroupAddon addonType="append">
                    <Button>Link!</Button>
                </InputGroupAddon>
            </InputGroup>
        </Container>
    );
};

export default NusModsPage;