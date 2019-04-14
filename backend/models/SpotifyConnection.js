const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");

class SpotifyConnection extends DBObjectBase {
  _initialize() {
    this.accessToken = new DBBasicTypes.DBString("");
    this.refreshToken = new DBBasicTypes.DBString("");
    this.expiresIn = new DBBasicTypes.DBNumber(0);
    this.userId = new DBBasicTypes.DBString("");
  }
}

module.exports = SpotifyConnection;