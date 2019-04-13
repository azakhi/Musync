const express = require('express');
const router = express.Router();
const models = require("../models/ModelExporter");
const spotifyController = require('./SpotifyController');

/* GET API listing. */
router.post('/berk', async function(req, res, next) {
  console.log("heree");
  let spotifyConnection = await new models.SpotifyConnection({accessToken: "",refreshToken:"xd",expiresIn:2,userId:""});
  console.log("heree1");
  let playlist =await new models.SpotifyItem({id:"2D5UM1WdOtCRppu5eW7gOT"});
  console.log("heree2");
  let song = await new models.SpotifyItem({id:"2fuCquhmrzHpu5xcA1ci9x"});
  console.log("heree3"); 
  await spotifyController.getLibrary(spotifyConnection);
 
  console.log("heree4"); 
  res.json({});
});

module.exports = router;
