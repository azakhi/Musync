const assert = require('assert');

const DBManager = require("./DBManager");
const DBObjectBase = require("./DBObjectBase");
const ModelManager = require("./ModelManager");

class ModelBase {
  constructor(obj) {
    if (!obj || !obj._id) { // New database entry
      this._isDirty = true;
    }
    
    this._isDeleted = false;
    this._isMarkedForDelete = false;
    this._initialize();
    this._parseObject(obj);
    
    let proxy = new Proxy(this, this);
    ModelManager.register(proxy);
    return proxy;
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
    assert.ok(!this._isDeleted, "Trying to modify a deleted model!");
    
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
  
  get isMarkedForDelete() {
    return this._isMarkedForDelete;
  }
  
  set isMarkedForDelete(value) {
    this._isMarkedForDelete = !!value;
  }

  get _this() {
    return this;
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
    if (this._isDeleted) {
      return;
    }
    
    if (this._isMarkedForDelete) {
      if (this._id !== null) {
        await DBManager.db.collection(this.collection).deleteOne({_id: this._id});
        this._isDeleted = true;
        ModelManager.unregister(this);
      }
    }
    else if (this._isDirty) {
      this._isDirty = false;
      if (this._id === null) {
        let result = await DBManager.db.collection(this.collection).insertOne(this.dbObject).catch((err) => { throw err });
        this._id = result.insertedId;
      }
      else {
        await DBManager.db.collection(this.collection).updateOne({_id: this._id}, {$set: this.dbObject}).catch((err) => { throw err });
      }
    }
  }
  
  static get collection() {
    assert.ok(false, "Collection name should be overriden by child!");
  }
  
  static async findOne(query) {
    let result = await DBManager.db.collection(this.collection).findOne(query);
    if (result && result._id) {
      let cached = ModelManager.acquire(result._id, this.collection);
      return (!!cached) ? cached : new this(result);
    }
    return null;
  }
  
  static async find(query) {
    let result = await DBManager.db.collection(this.collection).find(query).toArray();
    if (!result) return [];
    
    let models = [];
    for (let i = 0; i < result.length; i++) {
      let cached = ModelManager.acquire(result[i]._id, this.collection);
      let model = (!!cached) ? cached : new this(result[i]);
      models.push(model);
    }
    
    return models;
  }
  
  static async deleteOne(query) {
    let result = await DBManager.db.collection(this.collection).deleteOne(query);
    return !!result;
  }
  
  static async deleteMany(query) {
    let result = await DBManager.db.collection(this.collection).deleteMany(query);
    return !!result;
  }
}

module.exports = ModelBase;