//instance of check edilcek

const spotifyConnection = require('../models/SpotifyConnection');

const models = require("../models/Models");
var request = require('request-promise-native');
var querystring = require('querystring');
const config = require('../config.js');


class SpotifyController{
  constructor(){
  }
  static async createPlaylist(spotifyConnect) {
    
    var options = {
        url: 'https://api.spotify.com/v1/users/'+spotifyConnect.userId+'/playlists',
        body: JSON.stringify({
            name: "MusyncPlaylist",
            description: "This playlist is created automatically by Musync",
            public: false
          }),
        
        dataType:'json'
        ,headers: { 'Authorization': 'Bearer ' + spotifyConnect.accessToken,
        'Content-Type': 'application/json' }
      };
    
    await  request.post(options, function(error, response, body) {
        if (!error && response.statusCode === 201) {
           
          console.log(JSON.parse(body).id);
          console.log(response.statusCode);
            
        }else{
            console.log("error");
            
           
        }


    });
    
 
  
}
  static async addSong(spotifyConnect,playlist,song) {

    var songUri = 'spotify:track:'+song.id;
    var options = {
      url: 'https://api.spotify.com/v1/playlists/'+playlist.id+'/tracks',
      body: JSON.stringify({
          uris: [songUri]
        }),
      dataType:'json'
      ,headers: { 'Authorization': 'Bearer ' + spotifyConnect.accessToken,
      'Content-Type': 'application/json' }
    };

    await  request.post(options, function(error, response, body) {
      if (!error && response.statusCode === 201) {
        
        console.log(JSON.parse(body));
        console.log(response.statusCode);
          
      }else{
          console.log("error");
          
        
      }


  });
  }
  static async removeSong(spotifyConnect,playlist,song) {
    var songUri = 'spotify:track:'+song.id;
    var options = {
      url: 'https://api.spotify.com/v1/playlists/'+playlist.id+'/tracks',
      body: JSON.stringify({
          tracks:[{uri: songUri}]
        }),
      dataType:'json'
      ,headers: { 'Authorization': 'Bearer ' + spotifyConnect.accessToken,
      'Content-Type': 'application/json' }
    };
    await  request.delete(options, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        
        console.log(JSON.parse(body));
        console.log(response.statusCode);
          
      }else{
          console.log("error");
      }
    });
}
static async playSong(spotifyConnect,playlist) {

  var options = {
    url: 'https://api.spotify.com/v1/me/player/play',
    body: JSON.stringify({
        context_uri:"spotify:playlist:"+playlist.id
      }),
    dataType:'json'
    ,headers: { 'Authorization': 'Bearer ' + spotifyConnect.accessToken,
    'Content-Type': 'application/json' }
  };
  await  request.put(options, function(error, response, body) {
    if (!error && response.statusCode === 204) {
       
      console.log(body);
      console.log(response.statusCode);
        
    }else{
        console.log("error");
    }
  });
}
static async searchSong(spotifyConnect) {
  console.log(spotifyConnect.accessToken);
  console.log('https://api.spotify.com/v1/search?'+querystring.stringify({
    q: 'Under Pressure',
    type: 'track',
    
  }));
  var options = {
    url: 'https://api.spotify.com/v1/search?'+querystring.stringify({
      q: 'Under Pressure',
      type: 'track',
      
    }),
   headers: { 'Authorization': 'Bearer ' + spotifyConnect.accessToken ,
   'Content-Type': 'application/json'
  },
   json: true
  };  
  var result="";
  await  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      result=body;
      console.log(body);
      console.log(response.statusCode);
        
    }else{
        console.log("error");
    }
  });
  return result;
}
static async getLibrary(spotifyConnect) {
  
  var options = {
    url: 'https://api.spotify.com/v1/me/tracks',
    headers: { 'Authorization': 'Bearer ' + spotifyConnect.accessToken ,
   'Content-Type': 'application/json'
  },
   json: true
  };  
  var result="";
  await  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      result=body;
      console.log(body);
      console.log(response.statusCode);
        
    }else{
        console.log("error");
    }
  });
  return result;
}

  static async getSpotifyConnection(code, redirectUri) {
    let options = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
       'Content-Type': 'application/x-www-form-urlencoded '
      },
      form: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: config.spotify.clientID,
        client_secret: config.spotify.clientSecret,
      }
    };
    
    let r = await request.post(options).catch((err) => { return err });
    r = JSON.parse(r);
    if (r.access_token) {
      let spotifyConnection = new models.SpotifyConnection({
        accessToken: r.access_token,
        refreshToken: r.refresh_token,
        expiresIn: r.expires_in,
      });
      
      let userObject = await SpotifyController.getCurrentUser(spotifyConnection);
      if (userObject.id) {
        spotifyConnection.userId = userObject.id;
        return spotifyConnection;
      }
      
      return { error: true, response: {spotifyConnection, userObject}};
    }
    
    return { error: true, response: r};
  }
  
  static async getCurrentUser(spotifyConnection) {
    if (!(spotifyConnection instanceof models.SpotifyConnection)) {
      return {error: "Invalid spotify connection"};
    }
    
    let options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
    };
    
    let r = await request.get(options).catch((err) => { return err });
    r = JSON.parse(r);
    return r;
  }
}
module.exports =  SpotifyController;

