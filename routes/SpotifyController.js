//instance of check edilcek

const spotifyConnection = require('../models/SpotifyConnection');

const models = require("../models/ModelExporter");
var request = require('request');

var access_token = "BQCbM8hjQ0yZlu8BrsdqKjrXFAk9Z9q4Ymo5ek7XRyETJPQF46U0QWTPkclsrZH8SfUUIgJpmq9tcGR4oRPLoAJrjQfqw8k-d3CO1gOAEuoCIdCAGxBkp1cAkBUxpGPIJT5uceVl0PD9Mu0Ms4lx64ALB5UmKAs7UcC-WH7DU2dATttb4aaADC_iRXe2Qcw5U7eH1NT8Mt9WTjQikptK2oVou367nAAzCggwDmr-cQE1bEI_axAMwqhh4884Kv9niiuLJ-Q0Pm8YZAoJWxMb";
class SpotifyController{
  constructor(){
  }
  static async createPlaylist(spotifyConnect) {
    console.log("girdik"+spotifyConnect.userId+spotifyConnect.accessToken);
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
    
    console.log("burada");
  
}
  static async addSong(spotifyConnect,playlist,song) {
    console.log(song.id+"  "+playlist.id);
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
static async playSong (spotifyConnect,playlist) {
  var access_token = "BQC2ro8mwKQAMXrmdlzOmo1ztGXqAYIE5gpYvc8JYX7UWfDIAMs3vVLzsfq_ub0QEaVYGM_NZw4FdJ04amduYiryxy5jCDYAPx2Kl8Y5i8uhZ18hX40sMBWlAFLtweTGP_9EOf83Y_YhGuaQU-shcLn3Qm8TtBtJYsvzk2k2B92z2JVuvTM6KY_24xjngYKSb0X2-UHojF9D7xhMD0PqUy7RNGE8ANGvUK5OjdMH2HK1FESjVwXVs0VOr5pH9fRWeVVf558R4o7QdBW2zT16";
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
}
module.exports =  SpotifyController;

