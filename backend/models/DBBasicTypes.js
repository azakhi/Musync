const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const DBObjectBase = require("./DBObjectBase");

class DBBasicType extends DBObjectBase {
  constructor(hasDefaultValue = false, defaultValue = null) {
    super();
    if (hasDefaultValue) {
      assert.ok(this.constructor.isValidValue(defaultValue), "Invalid default value");
      this.value = defaultValue;
    }
  }
  
  _initialize() {
    // Override error
  }
  
  get (target, prop) {
    return this[prop];
  }
  
  set (target, prop, val) {
    this[prop] = val;
    return true;
  }

  get value() {
    assert.ok(typeof this._value !== undefined, "Variable is not initialized!");
    return this._value;
  }
  
  set value(value) {
    value = this.constructor.convert(value);
    assert.ok(this.constructor.isValidValue(value), "Invalid value!");
    this._value = value;
  }
  
  static convert(value) { // Override to provide implict conversion
    return value;
  }
  
  static isValidValue(value) {
    assert.ok(false, "isValidValue for DBBasicTypes should be implemented!");
  }
}

class DBString extends DBBasicType {
  constructor(hasDefaultValue = false, defaultValue = "") {
    super(hasDefaultValue, defaultValue);
  }
  
  static isValidValue(value) {
    return typeof value === 'string';
  }
}

class DBNumber extends DBBasicType {
  constructor(hasDefaultValue = false, defaultValue = 0) {
    super(hasDefaultValue, defaultValue);
  }
  
  static convert(value) {
    return Number(value);
  }
  
  static isValidValue(value) {
    return !isNaN(DBNumber.convert(value));
  }
}

class DBBoolean extends DBBasicType {
  constructor(hasDefaultValue = false, defaultValue = false) {
    super(hasDefaultValue, defaultValue);
  }
  
  static convert(value) {
    return !!value;
  }
  
  static isValidValue(value) {
    return true;
  }
}

class DBArray extends DBBasicType {
  constructor(hasDefaultValue = false, defaultValue = []) {
    super(hasDefaultValue, defaultValue);
  }

  get value() {
    assert.ok(typeof this._value !== undefined, "Variable is not initialized!");
    
    let arr = [];
    this._value.forEach(function(value, index, array) {
      if (value instanceof DBObjectBase) {
        arr[index] = value.value;
      }
      else {
        arr[index] = value;
      }
    });
    
    return arr;
  }
  
  set value(value) { // JS requires getter and setter to be overriden at the same time
    super.value = value;
  }
  
  static isValidValue(value) {
    return Array.isArray(value);
  }
}

class DBObjectID extends DBBasicType {
  constructor(hasDefaultValue = false, defaultValue = null) {
    super(hasDefaultValue, defaultValue);
  }
  
  static isValidValue(value) {
    return value instanceof ObjectID || value === null;
  }
}

class DBDate extends DBBasicType {
  constructor(hasDefaultValue = false, defaultValue = null) {
    super(hasDefaultValue, defaultValue);
  }
  
  static convert(value) {
    return new Date(value);
  }
  
  static isValidValue(value) {
    return !isNaN(DBDate.convert(value).getTime());
  }
}

module.exports = {
  DBString,
  DBNumber,
  DBBoolean,
  DBArray,
  DBObjectID,
  DBDate,
};