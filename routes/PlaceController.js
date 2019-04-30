const express = require('express');
const router = express.Router();
const config = require('../config.js');
const models = require("../models/Models");
const spotifyController = require('./SpotifyController');
const DBBasicTypes = require("../models/DBBasicTypes");

// Get a Place with given name
router.get('/', getPlace);

// Get playlist of a place
router.get('/playlist', getPlaylistOfPlace);

// Create a new Place
router.post('/', createNewPlace);

// Change place settings
router.post('/change', changePlaceSettings);

// Get closest Places to a location
router.post('/closest', findClosestPlaces);

router.get('/connect', connectToPlace);
router.post('/connect', connectToPlace);
router.get('/playback', getPlaybackInfo);

async function getPlace(req, res, next) {
  let result = await getPlaceRecord(req);
  if (!result.result) {
    res.status(400).send('Error: ' + result.error);
    return;
  }
  
  result = result.result;
  result = (req.session.userId && result.owner.toHexString() === req.session.userId) ? result.dbObject : result.publicInfo;
  res.json(result);
}

async function getPlaylistOfPlace(req, res, next) {
  let result = await getPlaceRecord(req);
  if (!result.result) {
    res.status(400).send('Error: ' + result.error);
    return;
  }
  
  result = result.result;
  if (!result.spotifyConnection || !result.spotifyConnection.accessToken) {
    res.status(400).send('Error: No spotify account is connected to Place');
    return;
  }
  
  if (!result.playlist || !result.playlist.spotifyPlaylist || !result.playlist.spotifyPlaylist.id) {
    let playlist = await getOrCreateSpotifyPlaylist(result.spotifyConnection);
    if (!playlist.result) {
      res.status(400).send('Error: ' + playlist.error);
      return;
    }
    
    result.playlist = playlist.result;
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
async function changePlaceSettings(req, res, next){
  if(!req.body){
    res.status(400).send('Error: Missing information!');
    return;
  }
  let result = await getPlaceRecord(req);
  if (!result.result) {
    res.status(400).send('Error: ' + result.error);
    return;
  }
  
  place = result.result;
  if(req.body.name){
    place.name = req.body.name;
  }
  if(req.body.location){
    let loc = place.location;
    loc.latitude = req.body.location.latitude;
    loc.longitude = req.body.location.longitude;
    loc.city = req.body.location.city;
    loc.country = req.body.location.country;
    place.location = loc;
  }

  if(req.body.genres){
    
    genres = [];
    for(const genreName of req.body.genres){
      let genre = await models.Genre.findOne({name: genreName});
      genres.push(genre._id);
    }
    place.genres = genres;
    
  }
  await place.commitChanges();
  res.status(200).json({});
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
    let genresArray = [];

    genresIds = place.genres;
    for (var i = 0; i < genresIds.length;i++){
      let genre = await models.Genre.findOne({_id: genresIds[i]});
      genresArray.push(genre.name);
    }
    let infObj = place.publicInfo;
    
    
    infObj['genres'] = genresArray;
    publicInfos.push(infObj);
  }

  
  res.json(publicInfos);
}

async function connectToPlace(req, res, next) {
  let result = await getPlaceRecord(req);
  if (!result.result) {
    res.status(400).send('Error: ' + result.error);
    return;
  }
  
  place = result.result;
  if (!req.query.pin && !req.body.pin) {
    res.status(400).send('Error: Pin required');
    return;
  }
  
  let pin = isNaN(Number(req.query.pin)) ? Number(req.body.pin) : Number(req.query.pin);
  if (pin !== place.pin) {
    res.status(400).send('Error: Incorrect pin');
    return;
  }
  
  if (!req.session.userId) { // Create unregistered user for this session
    let visitedPlace = new models.VisitedPlace({
      place: place._id,
    });
    let user = new models.User({
      isRegistered: false,
      visitedPlaces: [visitedPlace],
    });
    
    await user.commitChanges();
    req.session.userId = user._id.toHexString();
    req.session.isSpotifyRegistered = false;
    req.session.connectedPlace = place._id.toHexString();
    res.json({ // No need to send anything else. Let frontend redirect
      success: true,
    });
  }
  else {
    if (!models.ObjectID.isValid(req.session.userId)) {
      req.session.destroy();
      res.status(400).send('Error: Authentication is invalid. Please login again');
      return;
    }
    
    let user = await models.User.findOne({_id: new models.ObjectID(req.session.userId)});
    if(!user){
      req.session.destroy();
      res.status(400).send('Error: Authentication is invalid. Please login again');
      return;
    }
    
    let visitedPlace = new models.VisitedPlace({
      place: place._id,
    });
    let visitedPlaces = user.visitedPlaces;
    visitedPlaces.push(visitedPlace);
    user.visitedPlaces = visitedPlaces;
    
    req.session.connectedPlace = place._id.toHexString();
    res.json({ // No need to send anything else. Let frontend redirect
      success: true,
    });
  }
}

async function getPlaybackInfo(req, res, next) {
  let result = await getPlaceRecord(req);
  if (!result.result) {
    res.status(400).send('Error: ' + result.error);
    return;
  }
  
  result = result.result;
  if (!result.spotifyConnection || !result.spotifyConnection.accessToken) {
    res.status(400).send('Error: No spotify account is connected to Place');
    return;
  }
  
  if (!result.playlist || !result.playlist.spotifyPlaylist || !result.playlist.spotifyPlaylist.id) {
    res.status(400).send('Error: Place does not have a playlist');
    return;
  }
  
  let playlist = result.playlist;
  
  let curPlaying = await spotifyController.getCurrentlyPlaying(result.spotifyConnection);
  if (!curPlaying) {
    res.status(400).send('Error: Could not get playback info');
    return;
  }
  
  let context = (curPlaying.context && curPlaying.context.type === "playlist" && curPlaying.context.uri)
    ? curPlaying.context.uri.split(":").pop() : "";
  
  playlist.isPlaying = curPlaying.is_playing && curPlaying.currently_playing_type === "track" && context === playlist.spotifyPlaylist.id;
  
  if (playlist.isPlaying && curPlaying.item) {
    let currentSong = -1;
    for (let i = 0; i < playlist.songs.length; i++) {
      if (playlist.songs[i].spotifySong.id === curPlaying.item.id) {
        currentSong = i;
        break;
      }
    }
    
    playlist.currentSong = currentSong;
    if (currentSong >= 0 && curPlaying.timestamp && curPlaying.progress_ms) {
      playlist.currentSongStartTime = Date.now() - curPlaying.progress_ms;
    }
  }
  
  result.playlist = playlist;
  res.json({
    isPlaying: playlist.isPlaying,
    currentSong: playlist.currentSong >= 0 ? playlist.songs[playlist.currentSong] : null,
    currentSongStartTime: new Date(playlist.currentSongStartTime),
  });
}

async function getPlaceRecord(req) {
  let result = {};
  if (!req.query.placeId && !req.body.placeId && !req.session.placeId) {
    return {
      result: false,
      error: "Missing information",
    };
  }
  
  if (req.query.placeId || req.body.placeId) {
    let placeId = (req.query.placeId) ? req.query.placeId : req.body.placeId;
    if (!models.ObjectID.isValid(placeId)) {
      return {
        result: false,
        error: "Invalid place ID",
      };
    }
    else {
      result = await models.Place.findOne({_id: new models.ObjectID(placeId)});
    }
  }
  else if (!models.ObjectID.isValid(req.session.placeId)) {
    req.session.destroy();
    return {
      result: false,
      error: "Invalid session place ID",
    };
  }
  else {
    result = await models.Place.findOne({_id: new models.ObjectID(req.session.placeId)});
  }
    
  if (!result) {
    return {
      result: false,
      error: "No such place",
    };
  }
  
  return { result: result };
}

async function getOrCreateSpotifyPlaylist(spotifyConnection) {
  // First check if account already has one with the name
  let lists = await spotifyController.getPlaylists(result.spotifyConnection);
  if (!lists.items) {
    return {
      result: false,
      error: "Could not get playlists of account",
    };
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
      let artistArray = [];
      for(const artist of track.track.artists){
        let artistName = new DBBasicTypes.DBString(artist.name);
        artistArray.push(artistName);
      }
      let song = new models.Song({
        artistName: artistArray,
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
      currentSong: 0,
      currentSongStartTime: 0,
    });
    
    return {
      result: playlist,
    };
  }
  
  return {
    result: false,
    error: "Could not create or get playlist",
  };
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