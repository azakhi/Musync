import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import history from "../../utils/history";


export const Heading = () => {
  return (
    <Grid item xs={10} onClick={() => history.push('/')} style={{cursor: "pointer"}}>
      <Typography variant="h2" align="center" color="primary">
        <FontAwesomeIcon icon={["fab", "itunes-note"]}
                         style={{marginRight: "7px"}}
                         size="sm"/>
        Musync
      </Typography>
    
      <Typography align="center" color="secondary">
        Start listening what you want to listen
      </Typography>
    </Grid>
  );
};