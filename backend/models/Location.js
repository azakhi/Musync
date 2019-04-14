const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");

class Location extends DBObjectBase {
  _initialize() {
    this.latitude = new DBBasicTypes.DBNumber(0);
    this.longitude = new DBBasicTypes.DBNumber(0);
    this.district = new DBBasicTypes.DBString("");
    this.city = new DBBasicTypes.DBString("");
    this.country = new DBBasicTypes.DBString("");
  }
}

module.exports = Location;