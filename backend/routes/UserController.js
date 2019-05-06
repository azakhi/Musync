const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const models = require("../models/Models");
const spotifyController = require('./SpotifyController');

//TODO: Implement a better way to define and store salt for password
const passwordSalt = "salt";

router.get('/', getUser);
router.get('/checkconnection', checkConnection);
router.get('/register', registerUser);
router.post('/register', registerUser);
router.get('/login', loginWithSpotify);
router.post('/login', loginWithCredentials);
router.post('/update', updateUser);
router.get('/logout', logoutUser);
router.get('/connectspotify', connectSpotify);
router.get('/gethistory', getUserHistory);
router.get('/playlists', getUserPlaylists);
router.get('/recommendedplaces',getRecommendedPlaces);
async function getGenreNames(place) {
  let genres = [];
  let genresIds = place.genres;
  for (let i = 0; i < genresIds.length;i++){
    let genre = await models.Genre.findOne({_id: genresIds[i]});
    genres.push(genre.name);
  }
  return genres;
}
async function getRecommendedPlaces(req,res,next){
  if (req.query.userId) {
    if (!models.ObjectID.isValid(req.query.userId)) {
      res.status(400).send('Error: Invalid user id');
    }
  
  let user = await models.User.findOne({_id: new models.ObjectID(req.query.userId)});

  let preferredGenres = [];

  for(const visitedPlace of user.visitedPlaces){
    let visPlace = await models.Place.findOne({_id:visitedPlace.place});
    for (const genre of visPlace.genres){
      preferredGenres.push(genre);
    }
  }
  preferredGenres = [...new Set(preferredGenres)];
  
  let places = await models.Place.find();
  let result = [];
  

  for(const place of places){
    let flag = false;
    
    for(const visPlace of user.visitedPlaces){
      if(visPlace.place.toHexString() === place._id.toHexString()){
       
        flag = true;
        break;
      }
    }
    if(!flag){
      
      let genres = place.genres;
      
      for(const genre of genres){
        
        let flagI = false;
        for(const pGenre of preferredGenres){
          if(pGenre.toHexString()===genre.toHexString())
          {
            flagI = true;
          }
        }

        if(flagI){
          let genreName = await getGenreNames(place);
          let newGenres = [];
          for(const gName of genreName){
            newGenres.push(gName);
          }
          
          let resultItem = place.publicInfo;
          resultItem.genres = newGenres;
          
          result.push(resultItem);
          break;
        }
      }
    }
  }

  res.json({result:result});
  

  }
}

async function checkConnection(req, res, next) {
  res.json({
    isLoggedIn: !!req.session && !!req.session.userId,
    isSpotifyRegistered: !!req.session && !!req.session.userId && !!req.session.isSpotifyRegistered,
    hasSpotifyConnection: !!(req.session && req.session.spotifyConnection && models.SpotifyConnection.isValidValue(JSON.parse(req.session.spotifyConnection))),
  });
}

async function getUser(req, res, next) {
  if (req.query.userId) {
    if (!models.ObjectID.isValid(req.query.userId)) {
      res.status(400).send('Error: Invalid user id');
    }

    let user = await models.User.findOne({_id: new models.ObjectID(req.query.userId)});
    if (!user) {
      res.status(400).send('Error: No such user exists');
    }

    if (req.session && req.session.userId === req.query.userId) {
      res.json({
        _id: user._id,
        name: user.name,
        points: user.points,
        visitedPlaces: user.visitedPlaces,
        requestedSongs: user.requestedSongs,
        isRegistered: user.isRegistered,
        isSpotifyConnected: !!(user.spotifyConnection.accessToken),
        email: user.email,
        premiumEnd: user.premiumEnd,
        premiumTier: user.premiumTier,
        places: user.places,
      });
    }
    else { // send limited information
      res.json({
        name: user.name,
      });
    }

    return;
  }

  if (req.session && req.session.userId && models.ObjectID.isValid(req.session.userId)) {
    let user = await models.User.findOne({_id: new models.ObjectID(req.session.userId)});
    user.connectedPlace = req.session.connectedPlace;
    res.json(user);
    return;
  }

  res.status(400).send("Error: Login required!");
}

async function registerUser(req, res, next) {
  const body = req.body;
  const {name, email, password} = body;

  let spotifyConnection = null;
  if (req.session && req.session.spotifyConnection && models.SpotifyConnection.isValidValue(JSON.parse(req.session.spotifyConnection))) {
    spotifyConnection = new models.SpotifyConnection(JSON.parse(req.session.spotifyConnection));
  }

  if((!email || !password) && !spotifyConnection) {
    res.status(400).send('Error: Missing information!');
    return;
  }

  if (email && !validateEmail(email)) {
    res.status(400).send('Error: Invalid email!');
    return;
  }

  let user = new models.User({
    name: name ? name : spotifyConnection.userId,
    isRegistered: true,
    spotifyConnection: spotifyConnection ? spotifyConnection : new models.SpotifyConnection(),
    //TODO: Better email check
    email: email ? email : "",
    password: password ? crypto.createHash('md5').update(password + passwordSalt).digest('hex') : "",
  });

  let err = {};
  try {
    await user.commitChanges();
  } catch(e) {err = e};

  if (user._id) {
    req.session.userId = user._id.toHexString();
    req.session.isSpotifyRegistered = !!user.spotifyConnection && !!user.spotifyConnection.accessToken;
    res.json({ // No need to send anything else. Let frontend redirect
      success: true,
    });
    return;
  }

  res.json({
    success: false,
    error: err,
  });
}

async function loginWithSpotify(req, res, next) {
  let storedSpotifyConnection = req.session.spotifyConnection;
  clearSession(req);

  if (!req.session || !storedSpotifyConnection || !models.SpotifyConnection.isValidValue(JSON.parse(storedSpotifyConnection))) {
    res.status(400).send('Error: No valid connection information');
    return;
  }

  let user = null;
  let spotifyUserId = JSON.parse(storedSpotifyConnection).userId;
  if (spotifyUserId) {
    user = await models.User.findOne({"spotifyConnection.userId": spotifyUserId});
  }

  if (user) {
    user.lastLogin = Date.now();
    req.session.userId = user._id.toHexString();
    req.session.isSpotifyRegistered = true;
    res.json({ // No need to send anything else. Let frontend redirect
      success: true,
    });
    return;
  }

  res.status(400).send('Error: No such user');
}

async function loginWithCredentials(req, res, next) {
  clearSession(req);

  const {email, password} = req.body;

  if(!email || !password) {
    res.status(400).send('Error: Missing information!');
    return;
  }

  if (!validateEmail(email)) {
    res.status(400).send('Error: Invalid email!');
    return;
  }

  let user = await models.User.findOne({
    email: email,
    password: crypto.createHash('md5').update(password + passwordSalt).digest('hex'),
  });

  if (user) {
    user.lastLogin = Date.now();
    req.session.userId = user._id.toHexString();
    req.session.isSpotifyRegistered = !!user.spotifyConnection && !!user.spotifyConnection.accessToken;
    res.json({ // No need to send anything else. Let frontend redirect
      success: true,
    });
    return;
  }

  res.status(400).send('Error: No such user');
}

async function updateUser(req, res, next) {
  if (!req.session || !req.session.userId) {
    res.status(400).send('Error: User authentication required');
    return;
  }

  if (!models.ObjectID.isValid(req.session.userId)) {
    req.session.destroy();
    res.status(400).send('Error: Authentication is invalid. Please login again');
    return;
  }

  const {name, email, password, newPassword, location} = req.body;

  if(!name && !email && !newPassword) {
    res.json({ // Nothing to change
      success: true,
    });
    return;
  }

  if (email && !validateEmail(email)) {
    res.status(400).send('Error: Invalid email!');
    return;
  }

  let user = await models.User.findOne({_id: new models.ObjectID(req.session.userId)});
  if(!user){
    req.session.destroy();
    res.status(400).send('Error: Authentication is invalid. Please login again');
    return;
  }

  if ((email || newPassword) && user.password) {
    if(!password) {
      res.status(400).send('Error: Current password is required to change email or password');
      return;
    }
    else if (crypto.createHash('md5').update(password + passwordSalt).digest('hex') !== user.password) {
      res.status(400).send('Error: Wrong password');
      return;
    }
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (newPassword) user.password = crypto.createHash('md5').update(newPassword + passwordSalt).digest('hex');
  if (location && models.Location.isValidValue(location)) user.location = location;

  let err = null;
  try {
    await user.commitChanges();
  } catch(e) {err = e};

  if (!err) {
    res.json({
      success: true,
    });
    return;
  }

  res.json({
    success: false,
    error: err,
  });
}

async function logoutUser(req, res, next) {
  if(req.session) {
    req.session.destroy();
  }

  res.json({
    success: true,
  });
}

async function connectSpotify(req, res, next) {
  if (!req.session || !req.session.userId || !models.ObjectID.isValid(req.session.userId)) {
    if (req.session) {
        req.session.destroy();
    }

    res.status(400).send('Error: User authentication required');
    return;
  }

  if (!req.session || !req.session.spotifyConnection
  || !models.SpotifyConnection.isValidValue(JSON.parse(req.session.spotifyConnection)) || !JSON.parse(req.session.spotifyConnection).userId) {
    res.status(400).send('Error: No valid connection information');
    return;
  }

  let user = await models.User.findOne({_id: new models.ObjectID(req.session.userId)});

  if (user) {
    user.spotifyConnection = JSON.parse(req.session.spotifyConnection);
    req.session.isSpotifyRegistered = true;
    res.json({ // No need to send anything else. Let frontend redirect
      success: true,
    });
    return;
  }

  res.status(400).send('Error: No such user');
}

async function getUserPlaylists(req, res, next) {
  if (!req.session || !req.session.userId || !req.session.isSpotifyRegistered) {
    res.status(400).send('Error: No valid connection information');
    return;
  }
  
  const user = await models.User.findOne({_id: new models.ObjectID(req.session.userId)});
  let playlists = await spotifyController.getPlaylists(user.spotifyConnection);
  playlists = playlists.response.items;
  let result = playlists.map(playlist => {
    return {value: playlist.id, label: playlist.name};
  });
  
  res.status(200).json(result);
}

// Taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function clearSession(req) {
  if (!req.session) return;

  delete req.session.userId;
  delete req.session.isSpotifyRegistered;
  delete req.session.spotifyConnection;
  delete req.session.connectedPlace;
}

async function getUserHistory(req, res, next) {
  if (req.query && req.query.userId) {
    let user = await models.User.findOne({_id: new models.ObjectID(req.query.userId)});
    let resultPlaces = [];
    let resultSongs = [];

    if (user) {
      for( let i = 0; i < user.visitedPlaces.length; i++){
        let visitedPlace = user.visitedPlaces[i];
        let place = await models.Place.findOne({_id: visitedPlace.place});
        if(!place)
          continue;
        
        resultPlaces.push({name: place.name, visitNum: visitedPlace.visitCount});
      }
      
      for( let i = 0; i < user.requestedSongs.length; i++){
        let requestedSong = user.requestedSongs[i];
        resultSongs.push({name: requestedSong.name, artistName: requestedSong.artistName, placeName: ""});
      }
      
      res.status(200).json({
        name: user.name,
        points: user.points,
        visitedPlaces: resultPlaces,
        requestedSongs: resultSongs,
      });
    }
    else {
      res.status(400).send("Invalid user id.");
    }
  }
  else {
    res.status(400).send("Invalid request: Give user id.");
  }
}

module.exports = router;
