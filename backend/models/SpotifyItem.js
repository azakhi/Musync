const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");

class SpotifyItem extends DBObjectBase {
  _initialize() {
    this.id = new DBBasicTypes.DBString("");
    this.uri = new DBBasicTypes.DBString("");
    this.name = new DBBasicTypes.DBString("");
    this.description = new DBBasicTypes.DBString("");
  }
}

module.exports = SpotifyItem;