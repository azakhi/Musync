const assert = require('assert');

const DBManager = require("./DBManager");
const DBObjectBase = require("./DBObjectBase");
const ModelManager = require("./ModelManager");

class ModelBase {
  constructor(obj) {
    if (!obj || !obj._id) { // New database entry
      this._isDirty = true;
    }
    
    this._initialize();
    this._parseObject(obj);
    ModelManager.register(this);
    
    return new Proxy(this, this);
  }
  
  _initialize() {
    assert.ok(false, "Initializer should be implemented!");
  }
  
  _parseObject(obj) {
    if (!obj) {
      return;
    }
    
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        assert.ok(this[key] instanceof DBObjectBase, "Unknown field: " + key);
        this[key].value = obj[key];
      }
    }
  }
  
  get (target, prop) {
    if (this[prop] instanceof DBObjectBase) {
      return this[prop].value;
    }
    
    return this[prop];
  }
  
  set (target, prop, val) {
    if (this[prop] instanceof DBObjectBase) {
      if (this[prop].value !== val) {
        this[prop].value = val;
        this._isDirty = true;
      }
    }
    else {
      this[prop] = val;
    }
    
    return true;
  }
  
  get dbObject() {
    let obj = {};
    for (var key in this) {
      if (this.hasOwnProperty(key) && this[key] instanceof DBObjectBase) {
        obj[key] = this[key].value;
      }
    }
    
    return obj;
  }
  
  get collection() {
    return this.constructor.collection;
  }
  
  get isDirty() {
    return this._isDirty;
  }
  
  async commitChanges() {
    this._isDirty = false;
    if (this._id === null) {
      let result = await DBManager.db.collection(this.collection).insertOne(this.dbObject).catch((err) => { throw err });
      this._id = result.insertedId;
    }
    else {
      await DBManager.db.collection(this.collection).updateOne({_id: this._id}, {$set: this.dbObject}).catch((err) => { throw err });
    }
  }
  
  static get collection() {
    assert.ok(false, "Collection name should be overriden by child!");
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

module.exports = ModelBase;