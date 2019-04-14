const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");
const SpotifyItem = require("./SpotifyItem");

class Song extends DBObjectBase {
  _initialize() {
    this.name = new DBBasicTypes.DBString("");
    this.duration = new DBBasicTypes.DBNumber(0);
    this.genres = new DBBasicTypes.DBArray([]);
    this.spotifySong = new SpotifyItem();
  }
}

module.exports = Song;