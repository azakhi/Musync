const assert = require('assert');

class SpotifyConnection {
  constructor(obj) {
    assert.ok(SpotifyConnection.isValidValue(obj), "Invalid SpotifyConnection object");
    this._accessToken = obj.accessToken;
    this._refreshToken = obj.refreshToken;
    this._expiresIn = Number(obj.expiresIn);
  }
  
  get accessToken() {
    return this._accessToken;
  }
  
  get refreshToken() {
    return this._refreshToken;
  }
  
  get expiresIn() {
    return this._expiresIn;
  }
  
  get dbObject() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresIn: this.expiresIn,
    };
  }
  
  static isValidValue(value) {
    return !!value && !!value.accessToken && !!value.refreshToken && !isNaN(value.expiresIn);
  }
}

module.exports = SpotifyConnection;