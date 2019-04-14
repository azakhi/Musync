const assert = require('assert');

const DBBasicTypes = require("./DBBasicTypes");
const ModelBase = require("./ModelBase");
const SpotifyConnection = require("./SpotifyConnection");
const Playlist = require("./Playlist");
const Location = require("./Location");

class Place extends ModelBase {
  _initialize() {
    this._id = new DBBasicTypes.DBObjectID(null);
    this.name = new DBBasicTypes.DBString("");
    this.spotifyConnection = new SpotifyConnection();
    this.pin = new DBBasicTypes.DBNumber(0);
    this.votedSongs = new DBBasicTypes.DBArray([]);
    this.votes = new DBBasicTypes.DBArray([]);
    this.playlist = new Playlist();
    this.songRecords = new DBBasicTypes.DBArray([]);
    this.owner = new DBBasicTypes.DBObjectID(null);
    this.location = new Location();
    this.isPermanent = new DBBasicTypes.DBBoolean(false);
    this.genres = new DBBasicTypes.DBArray([]);
  }
  
  static get collection() {
    return "place";
  }
}

module.exports = Place;