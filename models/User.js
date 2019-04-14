const assert = require('assert');

const DBBasicTypes = require("./DBBasicTypes");
const ModelBase = require("./ModelBase");
const SpotifyConnection = require("./SpotifyConnection");
const Location = require("./Location");

class User extends ModelBase {
  _initialize() {
    this._id = new DBBasicTypes.DBObjectID(true, null);
    this.name = new DBBasicTypes.DBString(true, "");
    this.lastLogin = new DBBasicTypes.DBDate(true, Date.now());
    this.points = new DBBasicTypes.DBNumber(true, 0);
    this.location = new Location();
    this.visitedPlaces = new DBBasicTypes.DBArray(true, []);
    this.requestedSongs = new DBBasicTypes.DBArray(true, []);
    this.isRegistered = new DBBasicTypes.DBBoolean(true, false);
    this.spotifyConnection = new SpotifyConnection();
    this.email = new DBBasicTypes.DBString(true, "");
    this.password = new DBBasicTypes.DBString(true, "");
    this.premiumEnd = new DBBasicTypes.DBDate(true, null);
    this.premiumTier = new DBBasicTypes.DBNumber(true, 0);
    this.places = new DBBasicTypes.DBArray(true, []);
  }
  
  static get collection() {
    return "user";
  }
}

module.exports = User;