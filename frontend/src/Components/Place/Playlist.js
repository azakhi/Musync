import React, {Component} from "react";

import List from "@material-ui/core/List/index";
import {SERVER_DOMAIN} from "../../config";
import axios from "axios";
import SongItem from "./SongItem";


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
      <List dense style={{height: "70vh", overflow: "auto"}}>
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
  return <SongItem key={song.id} song={song}/>;
}

export default Playlist;