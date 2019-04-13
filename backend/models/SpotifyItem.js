const assert = require('assert');

class SpotifyItem {
  constructor(obj) {
    
    this._id = obj.id;
    this._uri = obj.uri;
    this._name = obj.name;
    this._description = obj.description;
  }
  
  get id() {
    return this._id;
  }
  
  get uri() {
    return this._uri;
  }
  
  get name() {
    return this._name;
  }
  
  get description() {
    return this._description;
  }
  
  get dbObject() {
    return {
      id: this.id,
      uri: this.uri,
      name: this.name,
      description: this.description,
    };
  }
  
  static isValidValue(value) {
    return !!value && !!value.id && !!value.uri && !!value.name && !!value.description;
  }
}

module.exports = SpotifyItem;