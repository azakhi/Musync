const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");

class SpotifyItem extends DBObjectBase {
  _initialize() {
    this.id = new DBBasicTypes.DBString(true, "");
    this.uri = new DBBasicTypes.DBString(true, "");
    this.name = new DBBasicTypes.DBString(true, "");
    this.description = new DBBasicTypes.DBString(true, "");
  }
}

module.exports = SpotifyItem;