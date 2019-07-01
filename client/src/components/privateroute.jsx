// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import HomePage from "../pages";

const PrivateRoute = ({ component: Component, exact, strict, path, authed, ...rest }) => {
  return (
    <Route
      exact={exact}
      strict={strict}
      path={path}
      render={props =>
        authed === true ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
}
  
export default PrivateRoute;
