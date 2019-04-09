const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config.js');
const DBManager = require('../models/DBManager');

const clear = process.argv.includes('clear');
console.log("Clear tables : " + clear);

if (DBManager.isConnected) {
  setupDatabase();
}
else {
  DBManager.connect(setupDatabase);
}

let opCounter = 0;
function setupDatabase() {
  // Create collections
  createCollection(DBManager.db, "user");
  createCollection(DBManager.db, "place");
  createCollection(DBManager.db, "genres");
}
  
function createCollection(db, name) {
  opCounter++;
  db.createCollection(name, function(err, res) {
    assert.equal(null, err);
    console.log("'" + name + "' collection created\n");
    
    if (clear) {
      clearCollection(db, name);
    }
    
    opFinishCallback()
  });
}

function clearCollection(db, name) {
  opCounter++;
  db.collection(name).deleteMany({}, function(err, res) {
    assert.equal(null, err);
    console.log("'" + name + "' collection cleared\n");
    opFinishCallback()
  });
}

function opFinishCallback() {
  opCounter--;
  if (opCounter <= 0) {
    process.exit();
  }
}
