const assert = require('assert');
const Song = require("./Song");

class SongRecord {
  constructor(obj) {
    assert.ok(SongRecord.isValidValue(obj), "Invalid SongRecord object");
    this._listenCount = Number(obj.listenCount);
    this._song = (obj.song instanceof Song) ? obj.song : new Song(obj.song);
  }
  
  get listenCount() {
    return this._listenCount;
  }
  
  get song() {
    return this._song;
  }
  
  get dbObject() {
    return {
      listenCount: this.listenCount,
      song: this.song.dbObject,
    };
  }
  
  static isValidValue(value) {
    return !!value && !isNaN(value.listenCount) && (value.song instanceof Song || Song.isValidValue(value.song));
  }
}

module.exports = SongRecord;