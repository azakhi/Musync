import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";


const SongItem = (props) => {
  let {song, onClick, showButton, type, disabled, highlighted} = props;
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
  
  let style = {};
  if(disabled){
    onClick = () => {};
    style = { opacity: 0.5 }
  }
  else if(highlighted){
    style={
      backgroundColor: "#e8f5e9"
    }
  }
  return (
    <ListItem disableGutters onClick={onClick} style={style}>
      {
        (song && song.songUri) &&
        <ListItemAvatar>
          <Avatar alt={song.name} src={song.songUri} style={{ borderRadius: 0 }}/>
        </ListItemAvatar>
      }
      
      <ListItemText>
        <Typography variant="body2" align="left" >
          {name}
        </Typography>
        <Typography variant="caption" align="left" >
          {artists && artists.join(', ')}
        </Typography>
      </ListItemText>
      
      <ListItemSecondaryAction>
        {
          showButton &&
          <Link color="secondary"
                href={songUri} style={{marginLeft: "5%"}}>
            <FontAwesomeIcon  icon="plus"/>
          </Link>
        }
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SongItem;