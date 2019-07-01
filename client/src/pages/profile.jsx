import React from 'react';
import PropTypes from 'prop-types';

class ProfilePage extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired
    }
    render() {
        return (
            <p>{JSON.stringify(this.props.user)}</p>
        );
    }
}

export default ProfilePage;
