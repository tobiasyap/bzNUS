import React from 'react';

import {
  Container,
  Navbar,
  NavbarBrand,
  Row,
  Col,
} from 'reactstrap';

function App() {
  return (
    <Container fluid className="Centered">
      <Navbar dark color="dark">
        <NavbarBrand href="/">bzNUS</NavbarBrand>
      </Navbar>
      <Row>
        <Col></Col>
      </Row>
      <Row>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default App;
