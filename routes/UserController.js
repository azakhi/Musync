const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const models = require("../models/Models");

//TODO: Implement a better way to define and store salt for password
const passwordSalt = "salt";

router.get('/', getUser);
router.post('/register', registerUser);

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
  }
  
  if (req.session && req.session.userId && models.ObjectID.isValid(req.session.userId)) {
    let user = await models.User.findOne({_id: new models.ObjectID(req.session.userId)});
    res.json(user);
  }
  
  res.json({});
}

async function registerUser(req, res, next) {
  const body = req.body;
  let {name, email, password, spotifyCode} = body;
  
  if((!email || !password) && !spotifyCode) {
    res.status(400).send('Error: Missing information!');
    return;
  }
  
  let spotifyConnection = new models.SpotifyConnection();
  let isSpotifyConnected = false;
  if (spotifyCode) {
    //TODO: Acquire spotify connection information using SpotifyController
    isSpotifyConnected = true;
  }
  
  if (!isSpotifyConnected && (!email || !password)) {
    res.status(400).send('Error: Spotify connection is not successful');
  }
  
  password = password ? crypto.createHash('md5').update(password + passwordSalt).digest('hex') : "";
  //TODO: Better email check
  email = email ? email : "";
  name = name ? name : "";
  
  let user = new models.User({
    name: name,
    isRegistered: true,
    spotifyConnection: spotifyConnection,
    email: email,
    password: password,
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
  }
  
  res.json({
    success: false,
    error: err,
  });
}

module.exports = router;