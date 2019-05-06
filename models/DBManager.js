const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config.js');


class DBManager {
  constructor() {
    this._database = null;
    this._mongoClient = null;
  }
  
  connect(callback) {
    if (this.isConnected) {
      callback();
      return;
    }
    
    const user = encodeURIComponent(config.db.user);
    const password = encodeURIComponent(config.db.pass);

    const url = user ? `mongodb+srv://${user}:${password}@${config.db.host}/` : `mongodb://${config.db.host}/`;
    this._mongoClient = new MongoClient(url, { useNewUrlParser: true });
    
    this._mongoClient.connect(function(err) {
      assert.strictEqual(null, err);
      callback();
    });
  }
  
  get isConnected() {
    return !!this._mongoClient && !!this._mongoClient.topology && this._mongoClient.topology.isConnected();
  }
  
  get db() {
    if (!this._database) {
      assert.ok(this.isConnected, "Database Connection Error");
      this._database = this._mongoClient.db(config.db.name);
    }
    
    return this._database;
  }
}


module.exports = new DBManager();