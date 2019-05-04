const models = require("../models/Models");
const request = require('request-promise-native');
const querystring = require('querystring');
const config = require('../config.js');


class SpotifyController{
  static async reorderTrack(spotifyConnection, playlist, rangeStart, insertBefore){
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlist.id + '/tracks',
      body: JSON.stringify({
        range_start: rangeStart,
        insert_before: insertBefore + 1,
      }),
      dataType:'json',
      headers: { 'Authorization': 'Bearer ' + spotifyConnection.accessToken, 'Content-Type': 'application/json' },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.put(options).catch((err) => { throw err }));
  }

  static async addSong(spotifyConnection,playlist,song) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let songUri = 'spotify:track:' + song;
    let options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlist + '/tracks',
      body: JSON.stringify({
        uris: [songUri]
      }),
      dataType:'json',
      headers: { 'Authorization': 'Bearer ' + spotifyConnection.accessToken, 'Content-Type': 'application/json' },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.post(options).catch((err) => { throw err }));
  }

  static async removeSong(spotifyConnection, playlist, song) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let songUri = 'spotify:track:'+song.id;
    let options = {
      url: 'https://api.spotify.com/v1/playlists/'+playlist.id+'/tracks',
      body: JSON.stringify({
        tracks:[{uri: songUri}]
      }),
      dataType:'json',
      headers: { 'Authorization': 'Bearer ' + spotifyConnection.accessToken, 'Content-Type': 'application/json' },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.delete(options).catch((err) => { throw err }));
  }

  static async playSong(spotifyConnection,playlist) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/me/player/play',
      body: JSON.stringify({
        context_uri:"spotify:playlist:"+playlist.id
      }),
      dataType:'json',
      headers: { 'Authorization': 'Bearer ' + spotifyConnection.accessToken, 'Content-Type': 'application/json' },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.put(options).catch((err) => { throw err }));
  }

  static async searchSong(spotifyConnection, songName) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/search?'+querystring.stringify({
        q: songName,
        type: 'track',
      }),
      headers: { 'Authorization': 'Bearer ' + spotifyConnection.accessToken , 'Content-Type': 'application/json' },
      json: true,
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.get(options).catch((err) => { throw err }));
  }

  static async getLibrary(spotifyConnection) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/me/tracks',
      headers: { 'Authorization': 'Bearer ' + spotifyConnection.accessToken , 'Content-Type': 'application/json' },
      json: true,
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.get(options).catch((err) => { throw err }));
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
      },
      simple: false,
      resolveWithFullResponse: true,
    };

    let r = SpotifyController.parseSpotifyResponse(await request.post(options).catch((err) => { throw err }));
    if (r.success) {
      r = r.response;
      let spotifyConnection = new models.SpotifyConnection({
        accessToken: r.access_token,
        refreshToken: r.refresh_token,
        expiresIn: new Date(Date.now() + Number(r.expires_in) * 1000),
      });

      let userObject = await SpotifyController.getCurrentUser(spotifyConnection);
      if (userObject.success) {
        spotifyConnection.userId = userObject.response.id;
        return {
          success: true,
          response: spotifyConnection,
          statusCode: 1,
        };
      }

      return userObject;
    }

    return r;
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
      },
      simple: false,
      resolveWithFullResponse: true,
    };

    let r = SpotifyController.parseSpotifyResponse(await request.post(options).catch((err) => { throw err }));
    if (r.success) {
      r = r.response;
      let sc = new models.SpotifyConnection({
        accessToken: r.access_token,
        refreshToken: spotifyConnection.refreshToken,
        expiresIn: new Date(Date.now() + Number(r.expires_in) * 1000),
        userId: spotifyConnection.userId,
      });

      return sc;
    }

    return r;
  }

  static async getCurrentUser(spotifyConnection) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/me',
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.get(options).catch((err) => { throw err }));
  }

  static async getPlaylists(spotifyConnection) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/users/' + spotifyConnection.userId + '/playlists',
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.get(options).catch((err) => { throw err }));
  }

  static async getPlaylist(spotifyConnection, playlistId) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/playlists/' + playlistId
      + '?fields=id,name,description,uri,tracks.items(track(id,name,duration_ms,uri,artists,album(id,uri,name,images)))',
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.get(options).catch((err) => { throw err }));
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
      headers: { 'Authorization': 'Bearer ' + spotifyConnection.accessToken, 'Content-Type': 'application/json', },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.post(options).catch((err) => { throw err }));
  }

  static async getSong(spotifyConnection, songId) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/tracks/' + songId,
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.get(options).catch((err) => { throw err }));
  }

  static async getAlbum(spotifyConnection, albumId) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/albums/' + albumId,
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.get(options).catch((err) => { throw err }));
  }

  static async getArtist(spotifyConnection, artistId) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/artists/' + artistId,
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.get(options).catch((err) => { throw err }));
  }

  static async getCurrentlyPlaying(spotifyConnection) {
    spotifyConnection = await SpotifyController.refreshSpotifyConnection(spotifyConnection);
    if (!(spotifyConnection instanceof models.SpotifyConnection)) return spotifyConnection;

    let options = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: { Authorization: 'Bearer ' + spotifyConnection.accessToken },
      simple: false,
      resolveWithFullResponse: true,
    };

    return SpotifyController.parseSpotifyResponse(await request.get(options).catch((err) => { throw err }));
  }

  static parseSpotifyResponse(response) {
    if (!response || isNaN(response.statusCode)) {
      return {
        success: false,
        response: response,
        statusCode: -1,
      }
    }

    return {
      success: response.statusCode < 400,
      response: JSON.parse(response.body),
      statusCode: response.statusCode,
    };
  }
}

module.exports =  SpotifyController;
