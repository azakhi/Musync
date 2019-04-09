const assert = require('assert');
const SpotifyItem = require("./SpotifyItem");

class Song {
  constructor(obj) {
    assert.ok(Song.isValidValue(obj), "Invalid Song object");
    this._name = obj.name;
    this._duration = Number(obj.duration);
    this._genres = obj.genres;
    this._spotifySong = (obj.spotifySong instanceof SpotifyItem) ? obj.spotifySong : new SpotifyItem(obj.spotifySong);
  }
  
  get name() {
    return this._name;
  }
  
  get duration() {
    return this._duration;
  }
  
  get genres() {
    return this._genres;
  }
  
  get spotifySong() {
    return this._spotifySong;
  }
  
  get dbObject() {
    return {
      name: this.name,
      duration: this.duration,
      genres: this.genres,
      spotifySong: this.spotifySong.dbObject,
    };
  }
  
  static isValidValue(value) {
    return !!value && !!value.name && !isNaN(value.duration) && Array.isArray(value.genres) &&
    (value.spotifySong instanceof SpotifyItem || SpotifyItem.isValidValue(value.spotifySong));
  }
}

module.exports = Song;