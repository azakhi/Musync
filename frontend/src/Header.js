import React from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";


export default function header(props) {
  const {isPlaceHeader} = props;
  const iconStyle = {
    marginLeft: "3%",
    marginRight: "3%",
    verticalAlign: "-35%"
  };
  
  const profileLink =
    <Grid item xs={4}>
      <Typography align="center">
        <Link href="/user" color="inherit">
          Profile
          <FontAwesomeIcon icon="user" size="2x" style={iconStyle}/>
        </Link>
      </Typography>
    </Grid>;
  
  const backLink =
    <Grid item xs={4}>
      <Typography align="center">
        <Link href="#back" color="inherit">
          <FontAwesomeIcon icon="chevron-left" size="2x" style={iconStyle}/>
          Back
        </Link>
      </Typography>
    </Grid>;
  
  return (
    <Grid container
          item
          xs={12}
          alignItems="center"
          justify="space-between">
      
      <Grid item xs={6}>
        <Typography variant="h4" align="center">
          <FontAwesomeIcon icon="guitar"/>
          Musync
        </Typography>
      </Grid>
    
      {isPlaceHeader ? profileLink : backLink}
    
    </Grid>
  );
}