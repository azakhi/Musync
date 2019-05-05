import React, {Component} from "react";
import axios from "axios/index"

import List from "@material-ui/core/List/index";
import {SERVER_DOMAIN} from "../../config";
import SongItem from "./SongItem";


class SearchList extends Component {
  
  constructor(props){
    super(props);
    this.addToPlaylist = this.addToPlaylist.bind(this);
    this.filterSongsByGenres = this.filterSongsByGenres.bind(this);
    
  }
  
  addToPlaylist(song) {
    const url = SERVER_DOMAIN + '/addsong';
    axios.post(url, { song: song })
      .then(() => {
        this.props.onAddPlaylist();
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  filterSongsByGenres(songs) {
    for(let song of songs){
      const songGenres = song.genres;
      let disabled = true;
      for(const songGenre of songGenres){
        if(this.placeGenresDict.hasOwnProperty(songGenre)){
          disabled = false;
          break;
        }
      }
      song.disabled = disabled;
    }
  }
  
  renderSongItems(songs) {
    return songs.map(song =>
      <SongItem song={song}
                onClick={() => this.addToPlaylist(song)}
                type="search_list"
                showButton={false}
                key={song.id}
                disabled={song.disabled}/>);
  }
  
  render() {
    let {songs, genres} = this.props;

    if(genres){
      const placeGenres = genres;
      this.placeGenresDict = {};
      placeGenres.forEach(placeGenre => this.placeGenresDict[placeGenre] = 1);
      this.filterSongsByGenres(songs);
    }
    
    return (
      <List dense>
        {this.renderSongItems(songs)}
      </List>
    );
  }
}

export default SearchList;