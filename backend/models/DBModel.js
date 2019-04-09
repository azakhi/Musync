const assert = require('assert');

const DBManager = require("./DBManager");

class DBModel {
  constructor(obj) {
    if (!!obj && !!obj._id) {
      this._id = obj._id;
      this._isDirty = false;
    }
    else { // New database entry
      this._id = "";
      this._isDirty = true;
    }
  }
  
  get _dbObject() {
    throw "DB object creator should be implemented!";
  }
  
  _parseObject(obj) {
    throw "Parser should be implemented!";
  }
  
  get collection() {
    return this.constructor.collection;
  }
  
  get id() {
    return this._id;
  }
  
  get isDirty() {
    return this._isDirty;
  }
  
  commitChanges() {
    if (this._id == "") {
      DBManager.db.collection(this.collection).insertOne(this._dbObject, function(err, res) {
        if (err) {
          throw err;
        }
      });
    }
    else {
      DBManager.db.collection(this.collection).updateOne({_id: this._id}, {$set: this._dbObject}, function(err, res) {
        if (err) {
          throw err;
        }
      });
    }
  }
  
  static get collection() {
    throw "Collection name should be overriden by child!";
  }
  
  static async findOne(query) {
    let result = await DBManager.db.collection(this.collection).findOne(query);
    return (!!result) ? new this(result) : null;
  }
  
  static async find(query) {
    let result = await DBManager.db.collection(this.collection).find(query).toArray();
    
    let models = [];
    for (let i = 0; i < result.length; i++) {
      let model = new this(result[i]);
      models.push(model);
    }
    
    return models;
  }
}

module.exports = DBModel;