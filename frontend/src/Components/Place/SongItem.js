import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";


const SongItem = (props) => {
  const {song, onClick, showButton, type} = props;
  if(!song)
    return;
  
  const {name} = song;
  let artists;
  let songUri = "";
  if(type === "playlist"){
    artists = song.artistName;
    songUri = song.spotifySong.uri;
  }
  else if(type === "search_list"){
    artists = song.artists.map(artist => artist.name);
  }
  
  return (
    <ListItem disableGutters divider onClick={onClick}>
      {
        showButton &&
        <Link color="secondary"
              href={songUri} style={{marginLeft: "5%"}}>
          <FontAwesomeIcon  icon="plus"/>
        </Link>
      }
      
      <ListItemText>
        <Typography variant="body2" align="left" >
          {name}
        </Typography>
        <Typography variant="caption" align="left" >
          {artists && artists.join(', ')}
        </Typography>
      </ListItemText>
    </ListItem>
  );
};

export default SongItem;