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
}

module.exports = Playlist;