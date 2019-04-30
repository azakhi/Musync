const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;

class ModelManager {
  constructor() {
    this._requestCounter = 0;
    this._models = [];
    this._models["place"] = [];
    this._models["user"] = [];
    this._models["genres"] = [];
    this._newModels = [];
  }
  
  register(model) {
    assert.ok(this._models[model.collection] != undefined, "Unknown model is being registered");
    if (!model._id) {
      this._newModels.push(model);
    }
    else {
      assert.ok(this._models[model.collection][model._id.toHexString()] == undefined, "Model is being registered twice");
      this._models[model.collection][model._id.toHexString()] = model;
    }
  }

  unregister(model) {
    assert.ok(this._models[model.collection] != undefined, "Unknown model is being unregistered");
    if (model._id) {
      this._models[model.collection].splice(model._id.toHexString(), 1);
    }
  }

  acquire(id, collection) {
    assert.ok(this._models[collection] != undefined, "Unknown model type is being acquired");
    if (id instanceof  ObjectID) {
      id = id.toHexString();
    }

    if (this._models[collection][id] != undefined) {
      return this._models[collection][id];
    }

    return null;
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