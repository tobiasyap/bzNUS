import React from "react";
import PropTypes from "prop-types";

export default class HomePage extends React.Component {
  
  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string,
      fullname: PropTypes.string,
      email: PropTypes.string,
      timtableurl: PropTypes.string,
      user_id: PropTypes.number,
      nusnet_id: PropTypes.string,
      group_ids: PropTypes.array
    })
  };

  state = {
    user: {},
    error: null,
    authenticated: false
  };

  componentDidMount() {
    // Fetch does not send cookies. So you should add credentials: 'include'
    fetch("http://localhost:5000/auth/login/success", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      }
    })
      .then(response => {
        if (response.status === 200) return response.json();
        throw new Error("failed to authenticate user");
      })
      .then(responseJson => {
        this.setState({
          authenticated: true,
          user: responseJson.user
        });
      })
      .catch(error => {
        this.setState({
          authenticated: false,
          error: "Failed to authenticate user"
        });
      });
  }

  render() {
    const { authenticated } = this.state;
    return (
      <div>
        {!authenticated ? (
              <h1>Welcome!</h1>
            ) : (
              <div>
                <h1>You have login succcessfully!</h1>
                <h2>Welcome {this.state.user.fullname}!</h2>
              </div>
            )}
      </div>
    );
  }

  _handleNotAuthenticated = () => {
    this.setState({ authenticated: false });
  };
}