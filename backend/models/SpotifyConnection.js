const assert = require('assert');

class SpotifyConnection {
  constructor(obj) {
    assert.ok(SpotifyConnection.isValidValue(obj), "Invalid SpotifyConnection object");
    this._accessToken = obj.accessToken;
    this._refreshToken = obj.refreshToken;
    this._expiressIn = Number(obj.expiressIn);
  }
  
  get accessToken() {
    return this._accessToken;
  }
  
  get refreshToken() {
    return this._refreshToken;
  }
  
  get expiressIn() {
    return this._expiressIn;
  }
  
  get dbObject() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiressIn: this.expiressIn,
    };
  }
  
  static isValidValue(value) {
    return !!value && !!value.accessToken && !!value.refreshToken && !isNaN(value.expiressIn);
  }
}

module.exports = SpotifyConnection;