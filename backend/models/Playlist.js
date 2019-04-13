const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");
const SpotifyItem = require("./SpotifyItem");

class Playlist extends DBObjectBase {
  _initialize() {
    this.songs = new DBBasicTypes.DBArray(true, []);
    this.currentSong = new DBBasicTypes.DBNumber(true, -1);
    this.currentSongStartTime = new DBBasicTypes.DBNumber(true, -1);
    this.spotifyPlaylist = new SpotifyItem();
  }
}

module.exports = Playlist;