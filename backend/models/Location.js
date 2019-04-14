const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");

class Location extends DBObjectBase {
  _initialize() {
    this.latitude = new DBBasicTypes.DBNumber(true, 0);
    this.longitude = new DBBasicTypes.DBNumber(true, 0);
    this.district = new DBBasicTypes.DBString(true, "");
    this.city = new DBBasicTypes.DBString(true, "");
    this.country = new DBBasicTypes.DBString(true, "");
  }
}

module.exports = Location;