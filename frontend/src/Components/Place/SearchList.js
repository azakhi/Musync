import React, {Component} from "react";

import List from "@material-ui/core/List/index";
import ListItem from "@material-ui/core/ListItem/index";
import ListItemText from "@material-ui/core/ListItemText/index";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/index";
import IconButton from "@material-ui/core/IconButton/index";
import Typography from "@material-ui/core/Typography/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {SERVER_DOMAIN} from "../../config";
import axios from "axios/index"

class SearchList extends Component {
  render() {
    const {songs, ids} = this.props;
    return (
      <List dense>
        {renderPlaylist(songs)}
      </List>
    );
  }
}

function addToPlaylist( songId, songName, artist ){
  const url = SERVER_DOMAIN + '/addsong';
  axios.post(url, {
    songId: songId,
    songName: songName,
    artistName: artist
  })
  .then(function (response) {
  })
  .catch(function (error) {
    console.log(error);
  });
}

function renderPlaylist(songs) {
  let counter = 0;
  return songs.map(song => {
    counter++;
    return renderSong(song);
  });
}

function renderSong(song) {
  const {id, name, artist, length} = song;

  return <ListItem key={id} disableGutters divider>
    <IconButton color="secondary"
    onClick={ ()=> addToPlaylist(id, name, artist)}>
    <FontAwesomeIcon  icon="plus" size="xs"/>
    </IconButton>

    <ListItemText>
      <Typography variant="body2" align="left" >
        {artist + " - " + name + " · " + length}
      </Typography>
    </ListItemText>

  </ListItem>;
}

export default SearchList;
