import React from 'react';
import { NavLink as RRNavLink } from 'react-router-dom'; // For single-page linking
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

import PropTypes from "prop-types";


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

  static propTypes = {
    authenticated: PropTypes.bool.isRequired
  };

  render() {
    const { location } = this.props;

    if (location.pathname.match('/login') || location.pathname.match('/404')){
        return null;
    }

    return (
      <div>
        <Navbar color="dark" dark expand="md">
          <NavbarBrand tag={RRNavLink} exact to="/">bzNUS</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={RRNavLink} exact to="/profile">Profile</NavLink>
              </NavItem>
              <NavItem>
                <NavLink onClick={this._handleLogoutClick}>Logout</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }

  _handleLogoutClick = () => {
    // Logout using Twitter passport api
    // Set authenticated state to false in the HomePage
    window.open("http://localhost:5000/auth/logout", "_self");
    this._handleNotAuthenticated();
  };

  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false });
  };
}