//instance of check edilcek

const spotifyConnection = require('../models/SpotifyConnection');

const models = require("../models/Models");
var request = require('request');
var querystring = require('querystring');


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
}
module.exports =  SpotifyController;

