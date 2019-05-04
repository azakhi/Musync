import React, {Component} from "react";

import List from "@material-ui/core/List/index";
import ListItem from "@material-ui/core/ListItem/index";
import ListItemText from "@material-ui/core/ListItemText/index";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/index";
import IconButton from "@material-ui/core/IconButton/index";
import Typography from "@material-ui/core/Typography/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {SERVER_DOMAIN} from "../../config";
import axios from "axios";


class Playlist extends Component {
  constructor(props) {
    super(props);
    this.getPlaylist = this.getPlaylist.bind(this);
    
    this.state = {
      songs: []
    };
  }
  
  componentDidMount() {
    this.getPlaylist();
    
    const refreshIntervalId = setInterval(this.getPlaylist, 5000);
    this.setState({
      refreshIntervalId: refreshIntervalId
    });
  }
  
  componentWillUnmount() {
    clearInterval(this.state.refreshIntervalId);
  }
  
  getPlaylist() {
    const placeId = this.props.placeId;
    if(!placeId)
      return;
    
    const url = SERVER_DOMAIN + "/place/playlist?placeId=" + placeId;
    axios.get(url).then((response) => {
      
      let data = response.data;
      let songs = data.songs;
      let songArr = [];
      
      for(let i = 0; i < songs.length; i++){
        songArr.push({
          name:songs[i].name,
          artist:songs[i].artistName[0],
          length:songs[i].duration
        });
      }
      this.setState({songs:songArr});
    });
  };
  
  render() {
    const {songs} = this.state;
  
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