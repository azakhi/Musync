import React, {Component} from "react";
import axios from "axios/index"

import List from "@material-ui/core/List/index";
import {SERVER_DOMAIN} from "../../config";
import SongItem from "./SongItem";


class SearchList extends Component {
  
  constructor(props){
    super(props);
    this.addToPlaylist = this.addToPlaylist.bind(this);
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
  
  render() {
    const {songs} = this.props;
    return (
      <List dense>
        {songs.map(song =>
          <SongItem song={song}
                    onClick={() => this.addToPlaylist(song)}
                    type="search_list"
                    showButton={false}
                    key={song.id} />
        )}
      </List>
    );
  }
}

export default SearchList;
