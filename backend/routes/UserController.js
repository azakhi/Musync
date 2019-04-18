const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const models = require("../models/Models");

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

async function checkConnection(req, res, next) {
  res.json({
    connection: !!(req.session && req.session.spotifyConnection && models.SpotifyConnection.isValidValue(JSON.parse(req.session.spotifyConnection)))
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
      res.json(user);
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
    res.json(user);
    return;
  }
  
  res.json({});
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
    name: name ? name : "",
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
  if (req.session && req.session.userId && models.ObjectID.isValid(req.session.userId)) {
    res.json({ // No need to send anything else. Let frontend redirect
      success: true,
    });
    return;
  }
  
  if (!req.session || !req.session.spotifyConnection || !models.SpotifyConnection.isValidValue(JSON.parse(req.session.spotifyConnection))) {
    res.status(400).send('Error: No valid connection information');
    return;
  }
  
  let user = null;
  let spotifyUserId = JSON.parse(req.session.spotifyConnection).userId;
  if (spotifyUserId) {
    user = await models.User.findOne({"spotifyConnection.userId": spotifyUserId});
  }
  
  if (user) {
    req.session.userId = user._id.toHexString();
    req.session.spotifyConnection = false; // No need to keep storing it.
    res.json({ // No need to send anything else. Let frontend redirect
      success: true,
    });
    return;
  }
  
  res.status(400).send('Error: No such user');
}

async function loginWithCredentials(req, res, next) {
  if (req.session && req.session.userId && models.ObjectID.isValid(req.session.userId)) {
    res.json({ // No need to send anything else. Let frontend redirect
      success: true,
    });
    return;
  }

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
    req.session.userId = user._id.toHexString();
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
  
  const {name, email, password, newPassword} = req.body;
  
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

// Taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = router;