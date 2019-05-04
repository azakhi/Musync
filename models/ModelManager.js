const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;

class ModelManager {
  constructor() {
    this._requestCounter = 0;
    this._models = [];
    this._models["place"] = [];
    this._models["user"] = [];
    this._models["genres"] = [];
    this._updates = [];
    this._updates["place"] = [];
    this._updates["user"] = [];
    this._updates["genres"] = [];
    this._newModels = [];
  }

  get updater() {
    return this._updater;
  }

  set updater(value) {
    this._updater = value;
  }
  
  register(model) {
    assert.ok(this._models[model.collection] !== undefined, "Unknown model is being registered");
    if (!model._id) {
      this._newModels.push(model);
    }
    else {
      assert.ok(this._models[model.collection][model._id.toHexString()] === undefined, "Model is being registered twice");
      this._models[model.collection][model._id.toHexString()] = model;
      if (model.updateInformation) {
        this.registerForUpdate(model._id, model.updateInformation.time, model.collection, model.updateInformation.method);
      }
    }
  }

  unregister(model) {
    assert.ok(this._models[model.collection] !== undefined, "Unknown model is being unregistered");
    if (model._id) {
      delete this._models[model.collection][model._id.toHexString()];
      this.unregisterUpdate(model._id, model.collection);
    }
  }

  acquire(id, collection) {
    assert.ok(this._models[collection] !== undefined, "Unknown model type is being acquired");
    if (id instanceof  ObjectID) {
      id = id.toHexString();
    }

    if (this._models[collection][id] !== undefined) {
      return this._models[collection][id];
    }

    return null;
  }

  registerForUpdate(id, time, collection, method) {
    let model = this.acquire(id, collection);
    time = isNaN(Number(time)) ? -1 : Number(time);
    if (model) {
      this.unregisterUpdate(id, collection);
      if (time > 0) {
        let timeout = setTimeout(async function (id, collection, method, manager) {
          let t = await manager.updater.constructor[method](id);
          manager.registerForUpdate(id, t, collection, method);
        }, time, id, collection, method, this);
        this._updates[model.collection][model._id.toHexString()] = timeout;
      }
    }
  }

  unregisterUpdate(id, collection) {
    if (id instanceof  ObjectID) {
      id = id.toHexString();
    }

    if (this._updates[collection][id] !== undefined) {
      clearTimeout(this._updates[collection][id]);
      delete this._updates[collection][id];
    }
  }
  
  commitChanges() {
    for(let i = 0; i < this._newModels.length; i++) {
      this._newModels[i].commitChanges();
    }
    
    this._newModels = [];
    this._requestCounter++;

    if (this._requestCounter > 100) {
      this._requestCounter = 0;
      for (let key in this._models) {
        for (let modelId in this._models[key]) {
          this._models[key][modelId].commitChanges();
        }
      }
    }
  }
}

module.exports = new ModelManager();