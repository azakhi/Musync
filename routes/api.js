const express = require('express');
const router = express.Router();
const models = require("../models/ModelExporter");

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
      let genre1 = new models.Genre({name: "Rock"});
      await genre1.commitChanges();
      let genre2 = new models.Genre({name: "Alternative Rock"});
      await genre2.commitChanges();
      
      let spotifyItem = new models.SpotifyItem({
        id: "id",
        uri: "uri",
        name: "name",
        description: "description"
      });
      
      let song = new models.Song({
        name: "My Little Pony",
        duration: 217,
        genres: [genre1.id, genre2.id],
        spotifySong: spotifyItem,
      });
      
      let playlist = new models.Playlist({
        songs: [song],
        currentSong: 0,
        currentSongStartTime: 0,
        spotifyPlaylist: spotifyItem
      });
      
      let songRecord = new models.SongRecord({
        listenCount: 4928357,
        song: song,
      });
      
      let spotifyConnection = new models.SpotifyConnection({
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        expiressIn: 0
      });
      
      let user = new models.User({
        name: "Da boss",
      });
      await user.commitChanges();
      
      let place = new models.Place({
        name: req.query.name,
        spotifyConnection: spotifyConnection,
        pin: 1994,
        votedSongs: [song, song, song], // Normally should never be same copies as reading from DB would create 3 different objects
        votes: [235235, 123, 564],
        playlist: playlist,
        songRecords: [song],
        owner: user.id,
        latitude: 35.678,
        longitude: 35.678,
        district: "Bilkent",
        city: "Ankara",
        country: "Turkey",
        isPermanent: true,
        genres: [genre1.id, genre2.id],
      });
      
      await place.commitChanges();
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
