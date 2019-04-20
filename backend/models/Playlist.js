const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");
const SpotifyItem = require("./SpotifyItem");
const Song = require("./Song");

class Playlist extends DBObjectBase {
  _initialize() {
    this.songs = new DBBasicTypes.DBArray([], Song);
    this.currentSong = new DBBasicTypes.DBNumber(-1);
    this.currentSongStartTime = new DBBasicTypes.DBNumber(-1);
    this.spotifyPlaylist = new SpotifyItem();
  }
  
  get currentlyPlaying() {
    if (this.currentSong.value && this.songs.value[this.currentSong.value]) {
      return this.songs.value[this.currentSong.value];
    }
    
    return null;
  }
}

module.exports = Playlist;