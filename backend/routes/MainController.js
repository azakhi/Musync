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
    res.send("Spotify connection is successful. You can close this tab now.");
  }
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
  let spotifyConnection = await new models.SpotifyConnection({accessToken: "",refreshToken:"xd",expiresIn:2,userId:""});
  let playlist =await new models.SpotifyItem({id:"2D5UM1WdOtCRppu5eW7gOT", uri:"", name:"", description:""});
  let song = await new models.SpotifyItem({id:"2fuCquhmrzHpu5xcA1ci9x", uri:"", name:"", description:""});
  await spotifyController.getLibrary(spotifyConnection);
  res.json({});
});

router.post('/searchsong', async function(req, res, next) {
  let songName = req.body.songName;
  let spotifyConnection = await new models.SpotifyConnection({accessToken: "TOKEN",refreshToken:"xd",expiresIn:2,userId:""});
  let result = await spotifyController.searchSong(spotifyConnection, songName );
  res.json(result);
});

router.post('/addsong', async function(req, res, next) {
  let songId = req.body.songId;
  let playlistId = req.body.playlistId;
  let spotifyConnection = await new models.SpotifyConnection({accessToken:"TOKEN",refreshToken:"xd",expiresIn:2,userId:""});
  await spotifyController.addSong(spotifyConnection, playlistId, songId );
  res.json({});
});

module.exports = router;
