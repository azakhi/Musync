const assert = require('assert');
const DBObjectBase = require("./DBObjectBase");
const DBBasicTypes = require("./DBBasicTypes");

class VisitedPlace extends DBObjectBase {
  _initialize() {
    this.date = new DBBasicTypes.DBDate(Date.now());
    this.place = new DBBasicTypes.DBObjectID(null);
    this.visitCount = new DBBasicTypes.DBNumber(1, 0);
    this.points = new DBBasicTypes.DBNumber(0, 0);
  }
}

module.exports = VisitedPlace;