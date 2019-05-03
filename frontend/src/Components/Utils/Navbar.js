import React, {Component} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index'
import Grid from "@material-ui/core/Grid/index";
import Link from "@material-ui/core/Link/index";
import Typography from "@material-ui/core/Typography/index";
import withAuth from "../../auth/withAuth";
import history from "../../utils/history";


const Navbar = (props) => {
  const {isPlaceHeader, isAuthenticated, authUser} = props;
  const iconStyle = {
    marginLeft: "3%",
    marginRight: "3%",
    verticalAlign: "-35%"
  };
  
  const profileLink =
    <Grid item xs={4}>
      <Typography align="center">
        <Link href={isAuthenticated ? authUser._id : "/user"} color="inherit">
          Profile
          <FontAwesomeIcon icon="user" size="2x" style={iconStyle}/>
        </Link>
      </Typography>
    </Grid>;
  
  const loginLink =
    <Grid item xs={4}>
      <Typography align="center">
        <Link href="/login" color="inherit">
          Login
        </Link>
      </Typography>
    </Grid>;
    
  const backLink =
    <Grid item xs={4} onClick={() => history.goBack()}>
      <Typography align="center">
        <FontAwesomeIcon icon="chevron-left" size="2x" style={iconStyle}/>
        Back
      </Typography>
    </Grid>;
  
  let renderedLink = "";
  if(isPlaceHeader)
    renderedLink = isAuthenticated ? profileLink : loginLink;
  else
    renderedLink = backLink;
    
  return (
    <Grid container
          item
          xs={12}
          alignItems="center"
          justify="space-between">
      
      <Grid item xs={6} onClick={() => history.push('/')}>
        <Typography variant="h4" align="center">
          <FontAwesomeIcon icon="guitar"/>
          Musync
        </Typography>
      </Grid>
      
      {renderedLink}
      
    </Grid>
  );
};

export default withAuth(Navbar);