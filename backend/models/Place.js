const assert = require('assert');

const DBBasicTypes = require("./DBBasicTypes");
const ModelBase = require("./ModelBase");
const SpotifyConnection = require("./SpotifyConnection");
const Playlist = require("./Playlist");
const Location = require("./Location");

class Place extends ModelBase {
  _initialize() {
    this._id = new DBBasicTypes.DBObjectID(true, null);
    this.name = new DBBasicTypes.DBString(true, "");
    this.spotifyConnection = new SpotifyConnection();
    this.pin = new DBBasicTypes.DBNumber(true, 0);
    this.votedSongs = new DBBasicTypes.DBArray(true, []);
    this.votes = new DBBasicTypes.DBArray(true, []);
    this.playlist = new Playlist();
    this.songRecords = new DBBasicTypes.DBArray(true, []);
    this.owner = new DBBasicTypes.DBObjectID(true, null);
    this.location = new Location();
    this.isPermanent = new DBBasicTypes.DBBoolean(true, false);
    this.genres = new DBBasicTypes.DBArray(true, []);
  }
  
  static get collection() {
    return "place";
  }
}

module.exports = Place;