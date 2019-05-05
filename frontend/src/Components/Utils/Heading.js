import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import history from "../../utils/history";


export const Heading = () => {
  return (
    <Grid item xs={10} onClick={() => history.push('/')}>
      <Typography variant="h2" align="center">
        <FontAwesomeIcon icon="guitar"/>
        Musync
      </Typography>
    
      <Typography align="center">
        Start listening what you want to listen
      </Typography>
    </Grid>
  );
};