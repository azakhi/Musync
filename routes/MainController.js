const express = require('express');
const router = express.Router();
const config = require('../config.js');
const models = require("../models/Models");
const spotifyController = require('./SpotifyController');

// For testing purposes only
router.get('/spotify', async function(req, res, next) {
  if (!req.session || !req.session.spotifyConnection || !models.SpotifyConnection.isValidValue(JSON.parse(req.session.spotifyConnection))) {
    res.redirect('https://accounts.spotify.com/en/authorize?response_type=code&client_id='
      + "b954f3b9ea8f48c28c716c0131dcaf92"
      + '&redirect_uri=' + encodeURIComponent("http://" + req.headers.host + "/callback/")
      + '&scope=' + encodeURIComponent(config.spotify.scopes)
      + '&show_dialog=true'
    );
  }
  else {
    res.send("Spotify connection is successful. You can close this tab now.");
  }
});
router.get('/cpts', async function(req, res, next) {
  if (!req.session || !req.session.spotifyConnection || !models.SpotifyConnection.isValidValue(JSON.parse(req.session.spotifyConnection))) {
    res.send("No connection");
    return;
  }
  
  if (!req.query.placeId) {
    res.send("No place ID");
    return;
  }
  
  let place = await models.Place.findOne({_id: new models.ObjectID(req.query.placeId)});
  
  if (!place) {
    res.send("No such place");
    return;
  }
  
  let spotifyConnection = new models.SpotifyConnection(JSON.parse(req.session.spotifyConnection));
  place.spotifyConnection = spotifyConnection;
  await place.commitChanges();
  
  res.send("Done");
});
router.get('/test3',async function(req, res, next){
let place = await models.Place.findOne({_id: new models.ObjectID(req.query.placeId)});
let votes = [0,0,0];
votes[req.query.songIndex] += Number(req.query.point);
place.votes = votes;
res.json(place.votes);




});


router.get('/callback', async function(req, res, next) {
  if (!req.session || !req.session.id) {
    res.status(400).send('Error: No session');
  }
  
  if (req.query.code) {
    const index = req.headers.referer.indexOf('?');
    const redirectURI = req.headers.referer.substring(0, index);
    let r = await spotifyController.getSpotifyConnection(req.query.code, redirectURI);
    if (r instanceof models.SpotifyConnection) {
      req.session.spotifyConnection = JSON.stringify(r);
      res.status(200).send("Successful.");
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
