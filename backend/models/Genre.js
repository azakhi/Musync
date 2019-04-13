const assert = require('assert');

const DBBasicTypes = require("./DBBasicTypes");
const ModelBase = require("./ModelBase");

class Genre extends ModelBase {
  _initialize() {
    this._id = new DBBasicTypes.DBObjectID(true, null);
    this.name = new DBBasicTypes.DBString(true, "");
  }
  
  static get collection() {
    return "genres";
  }
}

module.exports = Genre;