const assert = require('assert');

const DBManager = require("./DBManager");
const ModelManager = require("./ModelManager");
const DBModel = require("./DBModel");

class User extends DBModel {
  constructor(obj) {
    super(obj);
    
    this._parseObject(obj);
    ModelManager.register(this);
  }
  
  _parseObject(obj) {
    this._name = (!!obj && !!obj.name) ? obj.name : "";
  }
  
  get dbObject() {
    return {name: this.name};
  }
  
  get name() {
    return this._name;
  }
  
  set name(value) {
    if (this._name !== value) {
      this._name = value;
      this._isDirty = true;
    }
  }
  
  static get collection() {
    return "user";
  }
}

module.exports = User;