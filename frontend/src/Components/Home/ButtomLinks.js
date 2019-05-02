import React from "react";
import {Link as RouterLink} from "react-router-dom";

import Grid from "@material-ui/core/Grid/index";
import Link from "@material-ui/core/Link/index";
import Typography from "@material-ui/core/Typography/index";
import auth from "../../auth/auth";


export const ButtomLinks = (props) => {
  const to = (pathname) => {
    return {
      pathname: pathname,
      state: { from: window.location.pathname }
    }
  };
  
  const handleLogout = (event) => {
    event.preventDefault();
    
    auth.logout().finally(() => props.handleLogout());
  };
  
  const loginLink = <Link component={RouterLink}
                          to={to("/login")}
                          children="Login" />;
  const logoutLink = <Link component={RouterLink}
                           to={to("/logout")}
                           onClick={handleLogout}
                           children="Logout" />;
  const createAccLink = <Link component={RouterLink}
                              to={to("/register")}
                              children="Create an account"/>;
  const profileLink = <Link component={RouterLink}
                            to={to("/user")}
                            children="Profile"/>;
  return (
    <Grid item xs={12}>
      <Typography gutterBottom align="center">
        {props.authenticated ? profileLink : createAccLink}
      </Typography>
      
      <Typography gutterBottom align="center">
        {props.authenticated ? logoutLink : loginLink}
      </Typography>
    </Grid>
  );
};
