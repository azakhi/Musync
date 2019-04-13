const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");
const Song = require("./Song");

class SongRecord extends DBObjectBase {
  _initialize() {
    this.listenCount = new DBBasicTypes.DBNumber(true, 0);
    this.song = new Song();
  }
}

module.exports = SongRecord;