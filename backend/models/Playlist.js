const assert = require('assert');
const SpotifyItem = require("./SpotifyItem");

class Playlist {
  constructor(obj) {
    assert.ok(Playlist.isValidValue(obj), "Invalid Playlist object");
    this._songs = Array.isArray(obj.songs) ? obj.songs : [];
    this._currentSong = !isNaN(obj.currentSong) ? obj.currentSong : -1;
    this._currentSongStartTime = !isNaN(obj.currentSongStartTime) ? obj.currentSongStartTime : -1;
    this._spotifyPlaylist = (obj.spotifyPlaylist instanceof SpotifyItem) ? obj.spotifyPlaylist : new SpotifyItem(obj.spotifyPlaylist);
  }
  
  get songs() {
    return this._songs;
  }
  
  get currentSong() {
    return this._currentSong;
  }
  
  set currentSong(value) {
    assert.ok(!isNaN(value), "Invalid value for currentSong");
    this._currentSong = value;
  }
  
  get currentSongStartTime() {
    return this._currentSongStartTime;
  }
  
  set currentSongStartTime(value) {
    assert.ok(!isNaN(value), "Invalid value for currentSongStartTime");
    this._currentSongStartTime = value;
  }
  
  get spotifyPlaylist() {
    return this._spotifyPlaylist;
  }
  
  get dbObject() {
    let songs = [];
    for (let i = 0; i < this.songs.length; i++) {
      songs.push(this.songs[i].dbObject);
    }
    
    return {
      songs: songs,
      currentSong: this.currentSong,
      currentSongStartTime: this.currentSongStartTime,
      spotifyPlaylist: this.spotifyPlaylist.dbObject,
    };
  }
  
  static isValidValue(value) {
    return !!value && (value.spotifyPlaylist instanceof SpotifyItem || SpotifyItem.isValidValue(value.spotifyPlaylist));
  }
}

module.exports = Playlist;