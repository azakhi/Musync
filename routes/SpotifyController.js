//instance of check edilcek

const spotifyConnection = require('../models/SpotifyConnection');

const models = require("../models/Models");
var request = require('request-promise-native');
var querystring = require('querystring');
const config = require('../config.js');


class SpotifyController{
  constructor(){
  }
  static async reorderTrack(spotifyConnect,playlist,range_start,insert_before){
    console.log(range_start,insert_before);
    spotifyConnect = await SpotifyController.refreshSpotifyConnection(spotifyConnect);
    if (!(spotifyConnect instanceof models.SpotifyConnection)) return spotifyConnect;
    var options = {
      url: 'https://api.spotify.com/v1/playlists/'+playlist.id+'/tracks',
      body: JSON.stringify({
        range_start: range_start,
        insert_before: insert_before + 1

        }),
      dataType:'json'
      ,headers: { 'Authorization': 'Bearer ' + spotifyConnect.accessToken,
      'Content-Type': 'application/json' }
    };


    await  request.put(options, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        
        console.log(JSON.parse(body));
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
    }else{
        console.log("error");
    }
  });
}
static async searchSong(spotifyConnect, songName) {
  spotifyConnect = await SpotifyController.refreshSpotifyConnection(spotifyConnect);
  if (!(spotifyConnect instanceof models.SpotifyConnection)) return spotifyConnect;
  var options = {
    url: 'https://api.spotify.com/v1/search?'+querystring.stringify({
      q: songName,
      type: 'track',
    }),
   headers: { 'Authorization': 'Bearer ' + spotifyConnect.accessToken ,
   'Content-Type': 'application/json'
  },
   json: true
  };
  let result="";
  await  request.get(options, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      result=body;

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
        expiresIn: new Date(Date.now() + Number(r.expires_in) * 1000),
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

  static async refreshSpotifyConnection(spotifyConnection) {
    if (!(spotifyConnection instanceof models.SpotifyConnection) && !models.SpotifyConnection.isValidValue(spotifyConnection)) {
      return {error: "Invalid spotify connection"};
    }

    spotifyConnection = new models.SpotifyConnection(spotifyConnection);
    if (Date.now() < spotifyConnection.expiresIn.getTime()) { // No need to refresh
      return spotifyConnection;
    }

    let options = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
       'Content-Type': 'application/x-www-form-urlencoded '
      },
      form: {
        grant_type: "refresh_token",
        refresh_token: spotifyConnection.refreshToken,
        client_id: config.spotify.clientID,
        client_secret: config.spotify.clientSecret,
      }
    };

    let r = await request.post(options).catch((err) => { return err });
 
    r = JSON.parse(r);
    if (r.access_token) {
      let sc = new models.SpotifyConnection({
        accessToken: r.access_token,
        refreshToken: spotifyConnection.refreshToken,
        expiresIn: new Date(Date.now() + Number(r.expires_in) * 1000),
        userId: spotifyConnection.userId,
      });

      return sc;
    }

    return { error: true, response: r};
  }

  static async getCurrentUser(spotifyConnection) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
    };

    let r = await request.get(options).catch((err) => { return err });
    r = JSON.parse(r);
    return r;
  }

  static async getPlaylists(spotifyConnection) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/users/' + spotifyConnection.userId + '/playlists',
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
    };

    let r = await request.get(options).catch((err) => { return err });
    r = JSON.parse(r);
    return r;
  }

  static async getPlaylist(spotifyConnection, playlistId) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlistId
      + '?fields=id,name,description,uri,tracks.items(track(id,name,duration_ms,uri,artists,album(id,uri,name)))',
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
    };

    let r = await request.get(options).catch((err) => { return err });
    r = JSON.parse(r);
    return r;
  }

  static async createPlaylist(spotifyConnection, name, description) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/users/' + spotifyConnection.userId + '/playlists',
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      dataType: 'json',
      headers: {
        'Authorization': 'Bearer ' + spotifyConnection.accessToken,
        'Content-Type': 'application/json',
      },
    };

    let r = await request.post(options).catch((err) => { return err });
    r = JSON.parse(r);
    return r;
  }

  static async getSong(spotifyConnection, songId) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/tracks/' + songId,
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
    };

    let r = await request.get(options).catch((err) => { return err });
    r = JSON.parse(r);
    return r;
  }

  static async getAlbum(spotifyConnection, albumId) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/albums/' + albumId,
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
    };

    let r = await request.get(options).catch((err) => { return err });
    r = JSON.parse(r);
    return r;
  }

  static async getArtist(spotifyConnection, artistId) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/artists/' + artistId,
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
    };

    let r = await request.get(options).catch((err) => { return err });
    r = JSON.parse(r);
    return r;
  }

  static async getCurrentlyPlaying(spotifyConnection) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
    };

    let r = await request.get(options).catch((err) => { return err });

    r = JSON.parse(r);
    return r;
  }
}
module.exports =  SpotifyController;
