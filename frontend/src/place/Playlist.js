import React, {Component} from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


class Playlist extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {songs} = this.props;
  
    return (
      <List dense>
        {renderPlaylist(songs)}
      </List>
    );
  }
}

function renderPlaylist(songs) {
  let counter = 0;
  return songs.map(song => {
    counter++;
    song.id = 'song_' + counter;
    return renderSong(song);
  });
}

function renderSong(song) {
  const {id, name, artist, length} = song;
  
  return <ListItem key={id} disableGutters divider>
    <IconButton color="secondary" onClick={()=> console.log("Add " + name)}>
      <FontAwesomeIcon  icon="plus" size="xs"/>
    </IconButton>
    
    <ListItemText>
      <Typography variant="body2" align="left" >
        {artist + " - " + name + " · " + length}
      </Typography>
    </ListItemText>
    
    <ListItemSecondaryAction>
      <IconButton color="secondary" onClick={()=> console.log("Upvote " + name)}>
        <FontAwesomeIcon  icon="arrow-up" size="xs"/>
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>;
}

export default Playlist;