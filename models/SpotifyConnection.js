const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");

class SpotifyConnection extends DBObjectBase {
  _initialize() {
    this.accessToken = new DBBasicTypes.DBString(true, "");
    this.refreshToken = new DBBasicTypes.DBString(true, "");
    this.expiresIn = new DBBasicTypes.DBNumber(true, 0);
    this.userId = new DBBasicTypes.DBString(true, "");
  }
}

module.exports = SpotifyConnection;