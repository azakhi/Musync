const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");
const Song = require("./Song");

class RequestedSong extends DBObjectBase {
  _initialize() {
    this.song = new Song();
    this.date = new DBBasicTypes.DBDate(Date.now());
    this.place = new DBBasicTypes.DBObjectID(null);
  }
}

module.exports = RequestedSong;