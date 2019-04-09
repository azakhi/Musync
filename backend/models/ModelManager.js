const assert = require('assert');

const DBManager = require("./DBManager");

class ModelManager {
  constructor() {
    this._registeredModels = [];
  }
  
  register(model) {
    this._registeredModels.push(model);
  }
  
  commitChanges() {
    for(let i = 0; i < this._registeredModels.length; i++) {
      if(this._registeredModels[i].isDirty) {
        this._registeredModels[i].commitChanges();
      }
    }
    
    this._registeredModels = [];
  }
}

module.exports = new ModelManager();