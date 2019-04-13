const assert = require('assert');

const ModelManager = require("./ModelManager");
const ModelBase = require("./ModelBase");
const SpotifyConnection = require("./SpotifyConnection");
const Playlist = require("./Playlist");

class Place extends ModelBase {
  constructor(obj) {
    super(obj);
    
    this._parseObject(obj);
    ModelManager.register(this);
  }
  
  _parseObject(obj) {
    this._name = (!!obj && !!obj.name) ? obj.name : "";
    this._spotifyConnection = (!!obj && obj.spotifyConnection instanceof SpotifyConnection) ? obj.spotifyConnection :
      (SpotifyConnection.isValidValue(obj.spotifyConnection)) ? new SpotifyConnection(obj.spotifyConnection) : null;
    this._pin = (!!obj && !isNaN(obj.pin)) ? obj.pin : -1;
    this._votedSongs = (!!obj && Array.isArray(obj.votedSongs)) ? obj.votedSongs : [];
    this._votes = (!!obj && Array.isArray(obj.votes)) ? obj.votes : [0, 0, 0];
    this._playlist = (!!obj && obj.playlist instanceof Playlist) ? obj.playlist :
      (Playlist.isValidValue(obj.playlist)) ? new Playlist(obj.playlist) : null;
    this._songRecords = (!!obj && Array.isArray(obj.songRecords)) ? obj.songRecords : [];
    this._owner = (!!obj && !!obj.owner) ? obj.owner : "";
    this._latitude = (!!obj && !isNaN(obj.latitude)) ? obj.latitude : -1;
    this._longitude = (!!obj && !isNaN(obj.longitude)) ? obj.longitude : -1;
    this._district = (!!obj && !!obj.district) ? obj.district : "";
    this._city = (!!obj && !!obj.city) ? obj.city : "";
    this._country = (!!obj && !!obj.country) ? obj.country : "";
    this._isPermanent = (!!obj && !!obj.isPermanent) ? obj.isPermanent : false;
    this._genres = (!!obj && !!Array.isArray(obj.genres)) ? obj.genres : [];
  }
  
  get dbObject() {
    let votedSongs = [];
    for (let i = 0; i < this.votedSongs.length; i++) {
      votedSongs.push(this.votedSongs[i].dbObject);
    }
    
    let songRecords = [];
    for (let i = 0; i < this.songRecords.length; i++) {
      songRecords.push(this.songRecords[i].dbObject);
    }
    
    return {
      name: this.name,
      spotifyConnection: this.spotifyConnection.dbObject,
      pin: this.pin,
      votedSongs: votedSongs,
      votes: this.votes,
      playlist: this.playlist.dbObject,
      songRecords: songRecords,
      owner: this.owner,
      latitude: this.latitude,
      longitude: this.longitude,
      district: this.district,
      city: this.city,
      country: this.country,
      isPermanent: this.isPermanent,
      genres: this.genres,
    };
  }
  
  get name() {
    return this._name;
  }
  
  set name(value) {
    if (this._name !== value) {
      this._name = value;
      this._isDirty = true;
    }
  }
  
  get spotifyConnection() {
    return this._spotifyConnection;
  }
  
  set spotifyConnection(value) {
    if (this._spotifyConnection !== value) {
      if (value instanceof SpotifyConnection) {
        this._spotifyConnection = value;
        this._isDirty = true;
      }
      else if (SpotifyConnection.isValidValue(value)) {
        this._spotifyConnection = new SpotifyConnection(value);
        this._isDirty = true;
      }
    }
  }
  
  get pin() {
    return this._pin;
  }
  
  set pin(value) {
    if (this._pin !== value && !isNaN(value)) {
      this._pin = value;
      this._isDirty = true;
    }
  }
  
  get votedSongs() {
    return this._votedSongs;
  }
  
  get votes() {
    return this._votes;
  }
  
  get playlist() {
    return this._playlist;
  }
  
  set playlist(value) {
    if (this._playlist !== value) {
      if (value instanceof Playlist) {
        this._playlist = value;
        this._isDirty = true;
      }
      else if (Playlist.isValidValue(value)) {
        this._playlist = new Playlist(value);
        this._isDirty = true;
      }
    }
  }
  
  get songRecords() {
    return this._songRecords;
  }

  get owner() {
    return this._owner;
  }
  
  set owner(value) {
    if (this._owner !== value) {
      this._owner = value;
      this._isDirty = true;
    }
  }

  get latitude() {
    return this._latitude;
  }
  
  set latitude(value) {
    if (this._latitude !== value && !isNaN(value)) {
      this._latitude = value;
      this._isDirty = true;
    }
  }

  get longitude() {
    return this._longitude;
  }
  
  set longitude(value) {
    if (this._longitude !== value && !isNaN(value)) {
      this._longitude = value;
      this._isDirty = true;
    }
  }

  get district() {
    return this._district;
  }
  
  set district(value) {
    if (this._district !== value) {
      this._district = value;
      this._isDirty = true;
    }
  }

  get city() {
    return this._city;
  }
  
  set city(value) {
    if (this._city !== value) {
      this._city = value;
      this._isDirty = true;
    }
  }

  get country() {
    return this._country;
  }
  
  set country(value) {
    if (this._country !== value) {
      this._country = value;
      this._isDirty = true;
    }
  }

  get isPermanent() {
    return this._isPermanent;
  }
  
  set isPermanent(value) {
    if (this._isPermanent !== value) {
      this._isPermanent = !!value;
      this._isDirty = true;
    }
  }

  get genres() {
    return this._genres;
  }
  
  static get collection() {
    return "place";
  }
}

module.exports = Place;