const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");

class VisitedPlace extends DBObjectBase {
  _initialize() {
    this.date = new DBBasicTypes.DBDate(true, Date.now());
    this.place = new DBBasicTypes.DBObjectID(true, null);
  }
}

module.exports = VisitedPlace;