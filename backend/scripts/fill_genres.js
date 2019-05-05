const genres = require('./genres');
const DBManager = require("../models/DBManager");
const models = require("../models/Models");

const sleep = ms => new Promise( res => setTimeout(res, ms));

void async function() {
  console.log("Connecting to database..");
  DBManager.connect(function(){});
  while (!DBManager.isConnected) {
    await sleep(100);
  }

  console.log("Adding genres..");
  for (let i = 0; i < genres.length; i++) {
    let genre = new models.Genre({
      name: genres[i],
    });
    await genre.commitChanges();
  }

  console.log("Completed");
  process.exit();
}();