const express = require('express');
const router = express.Router();
const models = require("../models/Models");


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
  let placeId = req.query.placeId ? req.query.placeId : 
    (req.session && req.session.placeId) ? req.session.placeId : "";
    
  if (models.ObjectID.isValid(placeId)) {
    result = await models.Place.findOne({_id: new models.ObjectID(placeId)});
  }
  
  res.json(result ? result.playlist : result);
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