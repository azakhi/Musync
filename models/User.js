const assert = require('assert');

const DBBasicTypes = require("./DBBasicTypes");
const ModelBase = require("./ModelBase");

class User extends ModelBase {
  _initialize() {
    this._id = new DBBasicTypes.DBObjectID(true, null);
    this.name = new DBBasicTypes.DBString(true, "");
  }
  
  static get collection() {
    return "user";
  }
}

module.exports = User;