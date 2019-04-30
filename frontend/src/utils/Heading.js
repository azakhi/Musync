import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

export const Heading = () => {
  return (
    <Grid item xs={10}>
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