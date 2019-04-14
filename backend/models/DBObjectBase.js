const assert = require('assert');

class DBObjectBase {
  constructor (initialValue) {
    this._initialize();
    if (initialValue !== undefined) {
      this.value = initialValue;
    }
    
    return new Proxy(this, this);
  }
  
  _initialize() {
    assert.ok(false, "Initializer should be implemented!");
  }
  
  get (target, prop) {
    if (this[prop] instanceof DBObjectBase) {
      return this[prop].value;
    }
    
    return this[prop];
  }
  
  set (target, prop, val) {
    if (this[prop] instanceof DBObjectBase) {
      this[prop].value = val;
    }
    else {
      this[prop] = val;
    }
    
    return true;
  }
  
  get value() {
    let val = {};
    for (var key in this) {
      if (this.hasOwnProperty(key) && this[key] instanceof DBObjectBase) {
        val[key] = this[key].value;
      }
    }
    
    return val;
  }
  
  set value(val) {
    if (val instanceof DBObjectBase) {
      val = val.value;
    }
    
    assert.ok(this.constructor.isValidValue(val), "Invalid value!");
    
    for (var key in val) {
      if (val.hasOwnProperty(key)) {
        if (this[key] instanceof DBObjectBase) {
          this[key].value = val[key];
        }
        else {
          this[key] = val[key];
        }
      }
    }
  }
  
  static isValidValue(value) {
    // Check if every DBObjectBase field matches. For more/less strict check override this method
    for (var key in this) {
      if (this.hasOwnProperty(key) && this[key] instanceof DBObjectBase) {
        if (!value.hasOwnProperty(key) || !this[key].isValidValue(value[key])) {
          return false;
        }
      }
    }
    
    return true;
  }
}

module.exports = DBObjectBase;