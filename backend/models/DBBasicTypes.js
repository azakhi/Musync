const assert = require('assert');
const ObjectID = require('mongodb').ObjectID;
const DBObjectBase = require("./DBObjectBase");

class DBBasicType extends DBObjectBase {
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
    assert.ok(this.isValidValue(value), "Invalid value!");
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
  static isValidValue(value) {
    return typeof value === 'string';
  }
}

class DBNumber extends DBBasicType {
  _initialize(initialValue, minValue, maxValue) {
    minValue = DBNumber.convert(minValue);
    maxValue = DBNumber.convert(maxValue);
    this._min = (!isNaN(minValue)) ? minValue : Number.NEGATIVE_INFINITY;
    this._max = (!isNaN(maxValue)) ? maxValue : Number.POSITIVE_INFINITY;
  }
  
  isValidValue(value) {
    return DBNumber.isValidValue(value, this._min, this._max);
  }
  
  static convert(value) {
    return Number(value);
  }
  
  static isValidValue(value, minValue = Number.NEGATIVE_INFINITY, maxValue = Number.POSITIVE_INFINITY) {
    return !isNaN(value) && value >= minValue && value <= maxValue;
  }
}

class DBBoolean extends DBBasicType {
  static convert(value) {
    return !!value;
  }
  
  static isValidValue(value) {
    return true;
  }
}

class DBArray extends DBBasicType {
  _initialize(initialValue, type) {
    this._type = (type !== undefined) ? type : null;
  }
  
  get value() {
    assert.ok(typeof this._value !== undefined, "Variable is not initialized!");
    
    let arr = [];
    this._value.forEach(function(item, index, array) {
      if (item instanceof DBObjectBase) {
        arr[index] = item.value;
      }
      else {
        arr[index] = item;
      }
    });
    
    return arr;
  }
  
  set value(value) {
    assert.ok(this.isValidValue(value), "Invalid value!");
    
    let arr = [];
    let type = this._type;
    value.forEach(function(item, index, array) {
      if (type == null || item instanceof type) {
        arr[index] = item;
      }
      else {
        arr[index] = new type(item);
      }
    });
    
    this._value = arr;
  }
  
  isValidValue(value) {
    return DBArray.isValidValue(value, this._type);
  }
  
  static isValidValue(value, type = null) {
    if (!Array.isArray(value)) {
      return false;
    }
    
    if (type === null) {
      return true;
    }
    
    for (let item of value) {
      if (!(item instanceof type) && (!(type.prototype instanceof DBObjectBase) || !type.isValidValue(item))) {
        return false;
      }
    }
    
    return true;
  }
}

class DBObjectID extends DBBasicType {
  static isValidValue(value) {
    return value instanceof ObjectID || value === null;
  }
}

class DBDate extends DBBasicType {
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