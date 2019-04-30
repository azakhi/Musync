const assert = require('assert');
const models = require("../models/Models");
const spotifyController = require('./SpotifyController');

class UpdateController {
  static async updatePlaylist(place) {
    // Temporary, for testing
    return 5000;
  }
}

module.exports = new UpdateController();