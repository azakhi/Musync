const express = require('express');
const router = express.Router();
const models = require("../models/modelExporter");

/* GET API listing. */
router.get('/', function(req, res, next) {
  res.send('{}');
});

// Get a place with given name
router.get('/place/get', function(req, res, next) {
  (async () => {
    let result;
    if (!!req.query.name) {
      result = await models.Place.findOne({name: req.query.name});
    }
    else {
      result = await models.Place.find({});
    }
    
    res.send(JSON.stringify(result));
  })();
});

// Add a new place with given name
router.get('/place/add', function(req, res, next) {
  (async () => {
    if (!!req.query.name) {
      let place = new models.Place({name: req.query.name});
      res.send(JSON.stringify(place));
    }
  })();
});

// Reverse names of places
router.get('/place/reverse', function(req, res, next) {
  (async () => {
    let places = await models.Place.find({});
    for (let i = 0; i < places.length; i++) {
      places[i].name = places[i].name.split("").reverse().join("");
    }
    
    res.send(JSON.stringify(places));
  })();
});

module.exports = router;
