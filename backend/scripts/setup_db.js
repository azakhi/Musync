const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const config = require('../config.js');

const clear = process.argv.includes('clear');
console.log("Clear tables : " + clear);

const user = encodeURIComponent(config.db.user);
const password = encodeURIComponent(config.db.pass);

const url = user ? `mongodb://${user}:${password}@${config.db.host}:${config.db.port}/` : `mongodb://${config.db.host}:${config.db.port}/`;
const client = new MongoClient(url, { useNewUrlParser: true });

//Count active db operations
let opCounter = 0;

opCounter++;
client.connect(function(err) {
  assert.equal(null, err);
  console.log("Connected to server\n");

  const db = client.db(config.db.name);
  
  // Create collections
  createCollection(db, "user");
  createCollection(db, "place");
  
  opFinishCallback();
});

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
    client.close();
  }
}