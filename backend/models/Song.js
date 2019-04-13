const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");
const SpotifyItem = require("./SpotifyItem");

class Song extends DBObjectBase {
  _initialize() {
    this.name = new DBBasicTypes.DBString(true, "");
    this.duration = new DBBasicTypes.DBNumber(true, 0);
    this.genres = new DBBasicTypes.DBArray(true, []);
    this.spotifySong = new SpotifyItem();
  }
}

module.exports = Song;