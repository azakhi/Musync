const express = require('express');
const router = express.Router();
const models = require("../models/ModelExporter");

/* GET API listing. */
router.get('/', function(req, res, next) {
  res.send('{}');
});

module.exports = router;
