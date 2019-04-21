const express = require('express');
const router = express.Router();
const config = require('../config.js');
const models = require("../models/Models");
const spotifyController = require('./SpotifyController');


// Get a Place with given name
router.get('/', getPlace);

// Get playlist of a place
router.get('/playlist', getPlaylistOfPlace);

// Create a new Place
router.post('/', createNewPlace);

// Get closest Places to a location
router.post('/closest', findClosestPlaces);

async function getPlace(req, res, next) {
  let result = {};
  if (req.query.name) {
    result = await models.Place.findOne({name: req.query.name});
  }
  else if (req.query.placeId) {
    if (!models.ObjectID.isValid(req.query.placeId)) {
      res.status(400).send('Error: Invalid place ID');
      return;
    }
    
    result = await models.Place.findOne({_id: new models.ObjectID(req.query.placeId)});
  }
  else if (req.session && req.session.placeId && models.ObjectID.isValid(req.session.placeId)) {
    result = await models.Place.findOne({_id: new models.ObjectID(req.session.placeId)});
  }
  
  result = result ? result.publicInfo : result;
  res.json(result);
}

async function getPlaylistOfPlace(req, res, next) {
  let result = {};
  if (!req.query.placeId && !req.session.placeId) {
    res.json({});
    return;
  }
  
  if (req.query.placeId) {
    if (!models.ObjectID.isValid(req.query.placeId)) {
      res.status(400).send('Error: Invalid place ID');
      return;
    }
    else {
      result = await models.Place.findOne({_id: new models.ObjectID(req.query.placeId)});
    }
  }
  else if (!models.ObjectID.isValid(req.session.placeId)) {
    req.session.destroy();
    res.status(400).send('Error: Invalid session place ID');
    return;
  }
  else {
      result = await models.Place.findOne({_id: new models.ObjectID(req.session.placeId)});
  }
    
  if (!result) {
    res.status(400).send('Error: No such place');
    return;
  }
  
  if (!result.spotifyConnection || !result.spotifyConnection.accessToken) {
    res.status(400).send('Error: No spotify account is connected to Place');
    return;
  }
  
  // acquire playlist if not exists
  if (!result.playlist || !result.playlist.spotifyPlaylist || !result.playlist.spotifyPlaylist.id) {
    // First check if account already has one with the name
    let lists = await spotifyController.getPlaylists(result.spotifyConnection);
    if (!lists.items) {
      console.log(lists);
      res.status(400).send('Error: Could not get playlists of account');
      return;
    }
    
    let pl = {};
    for (let list of lists.items) {
      if (list.name == config.spotify.playlistName) {
        pl = list;
        break;
      }
    }
    
    if (pl.id) {
      pl = await spotifyController.getPlaylist(result.spotifyConnection, pl.id);
    }
    else { // Create if not
      pl = await spotifyController.createPlaylist(result.spotifyConnection, config.spotify.playlistName, config.spotify.playlistDecription);
    }
    
    if (pl.id) {
      let songs = [];
      for (let track of pl.tracks.items) {
        let spotifyItem = new models.SpotifyItem({
          id: track.track.id,
          uri: track.track.uri,
          name: track.track.name,
        });
        let song = new models.Song({
          name: track.track.name,
          duration: track.track.duration_ms,
          spotifySong: spotifyItem,
        });
        songs.push(song);
      }
      
      let spotifyPlaylist = new models.SpotifyItem({
        id: pl.id,
        uri: pl.uri,
        name: pl.name,
        description: pl.description,
      });
      let playlist = new models.Playlist({
        songs: songs,
        spotifyPlaylist: spotifyPlaylist,
      });
      
      result.playlist = playlist;
    }
    else {
      res.status(400).send('Error: Could not create or get playlist');
      return;
    }
  }
  
  res.json(result.playlist);
}

async function createNewPlace(req, res, next) {
  if (!req.session || !req.session.userId) {
    res.status(400).send('Error: User authentication required');
  }
  
  if (!models.ObjectID.isValid(req.session.userId)) {
    req.session.destroy();
    res.status(400).send('Error: Authentication is invalid. Please login again');
  }
  
  const body = req.body;
  const {placeName, latitude, longitude, spotifyInfo,
    isPermanent, district, city, country} = body;
  
  if(!placeName || !latitude || !longitude || !spotifyInfo){
    res.status(400).send('Error: Missing information!');
    return;
  }
  
  // Find Place owner
  let user = await models.User.findOne({_id: new models.ObjectID(req.session.userId)});
  if(!user){
    req.session.destroy();
    res.status(400).send('Error: Authentication is invalid. Please login again');
    return;
  }
  
  // Find Genre ids
  let genres = [];
  if(Array.isArray(body.genres)){
    for(const genreName of body.genres){
      let genre = await models.Genre.findOne({name: genreName});
      genres.push(genre._id);
    }
  }
  
  const {id, uri, name, description,
    accessToken, refreshToken, expiresIn} = spotifyInfo;
  let spotifyItem = new models.SpotifyItem({
    id: id,
    uri: uri,
    name: name,
    description: description
  });
  
  let spotifyConnection = new models.SpotifyConnection({
    accessToken: accessToken,
    refreshToken: refreshToken,
    expiresIn: expiresIn
  });
  
  let playlist = new models.Playlist({
    songs: [],
    currentSong: 0,
    currentSongStartTime: 0,
    spotifyPlaylist: spotifyItem
  });
  
  let location = new models.Location({
    latitude: latitude,
    longitude: longitude,
    district: district,
    city: city,
    country: country,
  });
  
  let place = new models.Place({
    name: placeName,
    owner: user._id,
    pin: 1994,
    playlist: playlist,
    genres: genres,
    votes: [],
    votedSongs: [],
    songRecords: [],
    spotifyConnection: spotifyConnection,
    location: location,
    isPermanent: !!isPermanent,
  });
  
  await place.commitChanges();
  res.send(JSON.stringify(place));
}

async function findClosestPlaces(req, res, next) {
  if(!req.body || !req.body.latitude || !req.body.longitude){
    res.status(400).send('Error: Missing information!');
    return;
  }
  
  const distance = 10; // Arbitrary distance for now
  const boundingBox = calculateBoundingBox(req.body, distance);
  const {minLat, maxLat, minLon, maxLon} = boundingBox;

  const query = {
    "location.latitude": {$gt: minLat, $lt: maxLat},
    "location.longitude": {$gt: minLon, $lt: maxLon}
  };
  const closePlaces = await models.Place.find(query);
  
  // Calculate distances of each candidate Place
  for(const place of closePlaces){
    const location = {latitude: place.location.latitude, longitude: place.location.longitude};
    place.distance = calculateDistanceInKm(req.body, location);
  }
  
  // Sort by distances before send
  closePlaces.sort(compareDistances);
  
  let publicInfos = [];
  for (const place of closePlaces) {
    publicInfos.push(place.publicInfo);
  }
  
  res.json(publicInfos);
}

// Used the formulation given in following page
// http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
function calculateBoundingBox(location, distance) {
  const lat = degToRad(location.latitude);
  const lon = degToRad(location.longitude);
  const earthRadius = 6371;
  // Angular radius
  const r = distance / earthRadius;
  
  const minLat = lat - r;
  const maxLat = lat + r;
  
  const latDelta = Math.asin(Math.sin(r) / Math.cos(lat));
  const minLon = lon - latDelta;
  const maxLon = lon + latDelta;
  
  return {
    minLat: radToDeg(minLat),
    maxLat: radToDeg(maxLat),
    minLon: radToDeg(minLon),
    maxLon: radToDeg(maxLon)
  };
}

// Haversine formula to calculate crow-fly distance
// https://stackoverflow.com/a/27943
function calculateDistanceInKm(location1, location2) {
  const {latitude: lat1, longitude: lon1} = location1;
  const {latitude: lat2, longitude: lon2} = location2;
  const earthRadius = 6371;
  
  const diffLat = degToRad(lat2 - lat1);
  const diffLon = degToRad(lon2 - lon1);
  
  const a = Math.sin(diffLat/2) * Math.sin(diffLat/2)
    + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2))
    * Math.sin(diffLon/2) * Math.sin(diffLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return earthRadius * c;
}

function degToRad(deg) {
  return deg * (Math.PI/180);
}

function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

function compareDistances(place1, place2) {
  if(place1.distance < place2.distance)
    return -1;
  else if(place1.distance > place2.distance)
    return 1;
  else
    return 0;
}


module.exports = router;