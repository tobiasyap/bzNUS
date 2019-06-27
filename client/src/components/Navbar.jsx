import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

export default class NavBar extends React.Component {
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
    const { location } = this.props;

    if (location.pathname.match('/login') || location.pathname.match('/404')){
        return null;
    }

    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/">bzNUS</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Groups
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    CP2016
                  </DropdownItem>
                  <DropdownItem>
                    IS1103
                  </DropdownItem>
                  <DropdownItem>
                    The Best Project Group
                  </DropdownItem>
                  <DropdownItem href="/group">
                    Group Page Example
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    Create Group
                  </DropdownItem>
                  <DropdownItem>
                    Edit Groups
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink href="/">MyTimetable</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/login">Logout</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}