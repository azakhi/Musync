const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");
const SpotifyItem = require("./SpotifyItem");

class Song extends DBObjectBase {
  _initialize() {
    this.name = new DBBasicTypes.DBString("");
    this.artistName = new DBBasicTypes.DBArray([],DBBasicTypes.DBString);
    this.duration = new DBBasicTypes.DBNumber(0, 0);
    this.genres = new DBBasicTypes.DBArray([], DBBasicTypes.DBObjectID);
    this.spotifySong = new SpotifyItem();
    this.songUri = new DBBasicTypes.DBString("");
  }
}

module.exports = Song;