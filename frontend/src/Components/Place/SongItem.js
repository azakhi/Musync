import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";


const SongItem = (props) => {
  const {song} = props;
  if(!song)
    return;
  
  const {id, name, artist} = song;
  
  return (
    <ListItem key={id} disableGutters divider>
      <IconButton color="secondary" onClick={()=> console.log("Add " + name)}>
        <FontAwesomeIcon  icon="plus" size="xs"/>
      </IconButton>
      
      <ListItemText>
        <Typography variant="body2" align="left" >
          {name}
        </Typography>
        <Typography variant="caption" align="left" >
          {artist}
        </Typography>
      </ListItemText>
    </ListItem>
  );
};

export default SongItem;