const express = require('express');
const router = express.Router();
const config = require('../config.js');
const models = require("../models/Models");
const spotifyController = require('./SpotifyController');

// For testing purposes only
router.get('/spotify', async function(req, res, next) {
  if (!req.session || !req.session.spotifyConnection || !models.SpotifyConnection.isValidValue(JSON.parse(req.session.spotifyConnection))) {
    res.redirect('https://accounts.spotify.com/en/authorize?response_type=code&client_id='
      + config.spotify.clientID
      + '&redirect_uri=' + encodeURIComponent("http://" + req.headers.host + "/callback/")
      + '&scope=' + encodeURIComponent(config.spotify.scopes)
      + '&show_dialog=true'
    );
  }
  else {
    res.send("Spotify connection is successful");
  }
});

router.get('/callback', async function(req, res, next) {
  if (!req.session || !req.session.id) {
    res.status(400).send('Error: No session');
  }
  
  if (req.query.code) {
    let r = await spotifyController.getSpotifyConnection(req.query.code, "http://" + req.headers.host + "/callback/");
    if (r instanceof models.SpotifyConnection) {
      req.session.spotifyConnection = JSON.stringify(r);
      res.redirect('/spotify');
    }
    else {
      res.status(400).send('Error: Spotify connection is not successful');
    }
  }
  else {
    res.send("");
  }
});

/* GET API listing. */
router.post('/berk', async function(req, res, next) {
  console.log("heree");
  let spotifyConnection = await new models.SpotifyConnection({accessToken: "",refreshToken:"xd",expiresIn:2,userId:""});
  console.log("heree1");
  let playlist =await new models.SpotifyItem({id:"2D5UM1WdOtCRppu5eW7gOT", uri:"", name:"", description:""});
  console.log("heree2");
  let song = await new models.SpotifyItem({id:"2fuCquhmrzHpu5xcA1ci9x", uri:"", name:"", description:""});
  console.log("heree3"); 
  await spotifyController.getLibrary(spotifyConnection);
 
  console.log("heree4"); 
  res.json({});
});

module.exports = router;
