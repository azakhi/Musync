const express = require('express');
const router = express.Router();
const models = require("../models/modelExporter");


// Get a Place with given name
router.get('/', getPlace);

// Create a new Place
router.post('/', createNewPlace);


async function getPlace(req, res, next) {
  let result;
  if (!req.query.name) {
    result = await models.Place.find({});
  }
  else {
    result = await models.Place.findOne({name: req.query.name});
  }
  
  res.send(JSON.stringify(result));
}

async function createNewPlace(req, res, next){
  const body = req.body;
  const {placeName, userId, latitude, longitude,
    isPermanent, district, city, country} = body;
  
  if(!placeName || !userId || !latitude || !longitude){
    res.status(400).send('Error: Missing information!');
    return;
  }
  
  // Find Place owner
  let user = await models.User.findOne({id: userId});
  if(!user){
    res.status(400).send('Error: Invalid user id!');
    return;
  }
  
  // Find Genre ids
  let genres = [];
  if(Array.isArray(body.genres)){
    for(const genreName of body.genres){
      let genre = await models.Genre.findOne({name: genreName});
      genres.push(genre.id);
    }
  }
  
  // TODO: Get the data from request
  let spotifyItem = new models.SpotifyItem({
    id: "id",
    uri: "uri",
    name: "name",
    description: "description"
  });
  
  // TODO: Get the data from request
  let spotifyConnection = new models.SpotifyConnection({
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    expiresIn: 0
  });
  
  let playlist = new models.Playlist({
    songs: [],
    currentSong: 0,
    currentSongStartTime: 0,
    spotifyPlaylist: spotifyItem
  });
  
  let place = new models.Place({
    name: placeName,
    owner: user.id,
    pin: 1994,
    playlist: playlist,
    genres: genres,
    votes: [],
    votedSongs: [],
    songRecords: [],
    spotifyConnection: spotifyConnection,
    latitude: latitude,
    longitude: longitude,
    district: district,
    city: city,
    country: country,
    isPermanent: isPermanent ? isPermanent : true,
  });
  
  await place.commitChanges();
  res.send(JSON.stringify(place));
}


module.exports = router;