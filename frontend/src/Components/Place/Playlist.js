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
      let songs = response.data.songs;
      
      this.setState({
        songs: songs
      });
    });
  };
  
  render() {
    const {songs} = this.state;
    return (
      <List dense style={{height: "70vh", overflow: "auto"}}>
        {songs.map(song =>
          <SongItem song={song}
                    showButton={true}
                    type="playlist"
                    key={song.spotifySong.id}/>)}
      </List>
    );
  }
}

export default Playlist;