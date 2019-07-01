import React, {Component} from 'react';

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
  Button,
  Alert
} from 'reactstrap';

import { Link } from 'react-router-dom';

class NusModsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            newTimetableURL: '',
            alert: '',
            error: null
        }
    }

    handleInputChange = (e) => {
        this.setState({newTimetableURL: e.target.value});
    };

    handleUpdateTimetableURL = () => {
        const encodedURL = encodeURIComponent(this.state.newTimetableURL);
        const userID = 2;
        fetch(`/api/users/${userID}/timetableurl`, {
            method: 'put',
            credentials: 'include',
            headers: { 
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({ timetableurl: encodedURL })
        })  
        .then(res => {
            if(res.status === 200) {
                this.setState({
                    alert: 'Successfully updated timetable.',
                    error: null
                });
                // Update app User object
            }
            else {
                throw new Error('Failed to update timetableurl');
            }
        })
        .catch(err => {
            this.setState({
                alert: 'Whoops! Error updating timetable.',
                error: err
            });
        })
    };

    render() {
        return (
            <div>
                <Container fluid className="Centered">
                    <Row>
                        <Col>Go to NUSMods, click on share/sync, copy link URL, paste URL</Col>
                    </Row>
                    <InputGroup>
                        <Input 
                            placeholder="Enter NUSMods URL"
                            value={this.state.newTimetableURL}
                            onChange={this.handleInputChange}
                        />
                        <InputGroupAddon addonType="append">
                            <Button onClick={this.handleUpdateTimetableURL}>Link!</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </Container>
                <div>
                    {this.state.alert && (
                        <Alert color={this.state.error ? 'danger' : 'success'}>
                            {this.state.alert}
                        </Alert>
                    )}
                </div>
            </div>
        );
    }
};

export default NusModsPage;