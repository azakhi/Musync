const assert = require('assert');

const DBBasicTypes = require("./DBBasicTypes");
const ModelBase = require("./ModelBase");
const SpotifyConnection = require("./SpotifyConnection");
const Location = require("./Location");

class User extends ModelBase {
  _initialize() {
    this._id = new DBBasicTypes.DBObjectID(null);
    this.name = new DBBasicTypes.DBString("");
    this.lastLogin = new DBBasicTypes.DBDate(Date.now());
    this.points = new DBBasicTypes.DBNumber(0);
    this.location = new Location();
    this.visitedPlaces = new DBBasicTypes.DBArray([]);
    this.requestedSongs = new DBBasicTypes.DBArray([]);
    this.isRegistered = new DBBasicTypes.DBBoolean(false);
    this.spotifyConnection = new SpotifyConnection();
    this.email = new DBBasicTypes.DBString("");
    this.password = new DBBasicTypes.DBString("");
    this.premiumEnd = new DBBasicTypes.DBDate(null);
    this.premiumTier = new DBBasicTypes.DBNumber(0);
    this.places = new DBBasicTypes.DBArray([]);
  }
  
  static get collection() {
    return "user";
  }
}

module.exports = User;