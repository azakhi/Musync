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
      + '&redirect_uri=' + encodeURIComponent("http://" + req.headers.host + "/callback2/")
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
    if (r.success) {
      req.session.spotifyConnection = JSON.stringify(r.response);
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
  if(!req.session || !req.session.userId){
    res.status(400).send('Error: Need authentication.');
    return;
  }

  if(!req.session.connectedPlace){
    res.status(400).send('Error: Connect to place.');
    return;
  }

  if(!req.body.songName){
    res.status(400).send('Error: Missing information.');
    return;
  }

  let songName = req.body.songName;
  let spotifyConnection;
  if(req.session.isSpotifyRegistered){
    let userId = req.session.userId;
    let user = await models.User.findOne({_id: new models.ObjectID(userId)});
    spotifyConnection = user.spotifyConnection;
  }
  else{
    let connectedPlaceId = req.session.connectedPlace;
    let place = await models.Place.findOne({_id: new models.ObjectID(connectedPlaceId)});
    spotifyConnection = place.spotifyConnection;
  }

  let songsWithoutGenres = await spotifyController.searchSong(spotifyConnection, songName);
  songsWithoutGenres = songsWithoutGenres.response.tracks.items;

  let artistIds = songsWithoutGenres.map(song => {
    if(song.artists && song.artists.length > 0)
      return song.artists[0].id;
  });

  artistIds = [...new Set(artistIds)].slice(0, 20);

  let artists = await spotifyController.searchArtists(spotifyConnection, artistIds);
  artists = artists.response.artists;

  for(let artist of artists){
    const artistId = artist.id;

    for(let song of songsWithoutGenres){
      if(!song.artists || song.artists.length < 1)
        continue;

      const songArtistId = song.artists[0].id;
      if(artistId !== songArtistId)
        continue;

      song.genres = artist.genres;
    }
  }

  res.json(songsWithoutGenres);
});

router.post('/addsong', async function(req, res, next) {
  if(!req.session || !req.session.userId){
    res.status(400).send('Error: Need authentication.');
    return;
  }

  if(!req.session.connectedPlace){
    res.status(400).send('Error: Connect to place.');
    return;
  }

  if(!req.body.song || !req.body.song.id){
    res.status(400).send('Error: Missing information.');
    return;
  }

  let userId = req.session.userId;
  let user = await models.User.findOne({_id: new models.ObjectID(userId)});

  let song = req.body.song;
  let artistArray = song.artists.map(artist => artist.name);

  let songObj = new models.Song({
    name: song.name,
    artistName: artistArray,
    duration: song.duration_ms
  });

  if(user){
    let songList = user.requestedSongs;
    songList.push(songObj);
    user.requestedSongs = songList;
  }

  let connectedPlaceId = req.session.connectedPlace;
  let place = await models.Place.findOne({_id: new models.ObjectID(connectedPlaceId)});
  let playlist = place.playlist;
  playlist.songs.push(songObj);
  place.playlist = playlist;

  let spotifyConnection = place.spotifyConnection;
  let playlistId = playlist.spotifyPlaylist.id;
  await spotifyController.addSong(spotifyConnection, playlistId, song.id);

  res.status(200).json({ success: true });
});

async function getGenreNames(place) {
  let genres = [];
  let genresIds = place.genres;
  for (let i = 0; i < genresIds.length;i++){
    let genre = await models.Genre.findOne({_id: genresIds[i]});
    genres.push(genre.name);
  }
  return genres;
}

router.get('/allplaces', async function(req, res, next) {
  let places = await models.Place.find();
  let results = [];

  for( let i = 0; i < places.length; i++){
    let genreName = await getGenreNames(places[i]);
    let result = places[i].publicInfo;
    result.genres = genreName;
    results.push(result);
  }
  res.status(200).json(results);
});

router.get('/genres', async function(req, res, next) {
  let genres = await models.Genre.find();
  let result = [];
  for( let i = 0; i < genres.length; i++){
    if(genres[i]) {
      result.push({
        value: genres[i].name,
        label: genres[i].name
      });
    }
  }
  res.status(200).json(result);
});

router.get('/p', async function(req, res, next) {
  let genres = await models.Genre.find();
  let result = [];
  for( let i = 0; i < genres.length; i++){
    if(genres[i]) {
      result.push({
        value: genres[i].name,
        label: genres[i].name
      });
    }
  }
  res.status(200).json(result);
});

module.exports = router;
