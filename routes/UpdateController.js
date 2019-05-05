const assert = require('assert');
const models = require("../models/Models");
const ModelManager = require("../models/ModelManager");
const spotifyController = require('./SpotifyController');
const placeController = require('./PlaceController');


class UpdateController {
  static async updatePlaylist(placeId) {
  
    let place = ModelManager.acquire(placeId, models.Place.collection);
    if (!place) {
      return -1;
    }

    if (!place.spotifyConnection || !place.spotifyConnection.accessToken) {
      return -1; // No need to update this place
    }

    // First check if place has a playlist to track and create/find if necessary
    if (!place.playlist || !place.playlist.spotifyPlaylist || !place.playlist.spotifyPlaylist.id) {
      let playlist = await placeController.getOrCreateSpotifyPlaylist(place.spotifyConnection);
      // TODO: Check response in a detailed way to decide whether to keep updating
      if (!playlist) {
        return 3000; // Update again soon to retry
      }

      place.playlist = playlist;
    }

    // Check if currently anything is playing and whether it is Musync list
    let currentlyPlaying = await spotifyController.getCurrentlyPlaying(place.spotifyConnection);
    // TODO: Check response in a detailed way to decide whether to keep updating
    if (!currentlyPlaying.success) {
      return 3000; // Update again soon to retry
    }
    else { currentlyPlaying = currentlyPlaying.response }

    let contextId = (currentlyPlaying.context && currentlyPlaying.context.type === "playlist" && currentlyPlaying.context.uri)
      ? currentlyPlaying.context.uri.split(":").pop() : "";

    if (!(currentlyPlaying.is_playing && currentlyPlaying.currently_playing_type === "track" && contextId === place.playlist.spotifyPlaylist.id)) {
      // Our list is not playing. Update less frequently
      let updatedPlaylist = place.playlist;
      updatedPlaylist.isPlaying = false;
      place.playlist = updatedPlaylist;
      return 30 * 1000;
    }

    let isStartedPlaying = false;
    if (!place.playlist.isPlaying) {
      isStartedPlaying = true;
      let updatedPlaylist = place.playlist;
      updatedPlaylist.isPlaying = true;
      place.playlist = updatedPlaylist;
    }

    // Currently playing information of place updated later in this method

    let isCurrentlyPlayingChanged = place.playlist.currentSong < 0 || place.playlist.currentSong >= place.playlist.songs.length
      || place.playlist.songs[place.playlist.currentSong].spotifySong.id !== currentlyPlaying.item.id;

    // Update playlist and determine changes if there is any
    let originalPlaylist = await spotifyController.getPlaylist(place.spotifyConnection, place.playlist.spotifyPlaylist.id);
    if (!originalPlaylist.success) {
      return 3000; // Update again soon to retry
    }

    originalPlaylist = originalPlaylist.response;
    // Check if playlist has changed
    if (originalPlaylist.snapshot_id !== place.playlist.snapshotId) {
      let songs = [];
      for (let track of originalPlaylist.tracks.items) {
        let spotifyItem = new models.SpotifyItem({
          id: track.track.id,
          uri: track.track.uri,
          name: track.track.name,
        });

        let artistArray = [];
        for(const artist of track.track.artists){
          artistArray.push(artist.name);
        }

        let trackAlbumImages = track.track.album.images;
        let song = new models.Song({
          songUri: trackAlbumImages ? trackAlbumImages[0].url : "",
          artistName: artistArray,
          name: track.track.name,
          duration: track.track.duration_ms,
          spotifySong: spotifyItem,
        });
        songs.push(song);
      }

      place.playlist = new models.Playlist({
        songs: songs,
        spotifyPlaylist: place.playlist.spotifyPlaylist,
        currentSong: place.playlist.currentSong,
        currentSongStartTime: place.playlist.currentSongStartTime,
        isPlaying: place.playlist.isPlaying,
        snapshotId: originalPlaylist.snapshot_id,
      });
    }

    // Check if currently playing song index has changed
    if (isCurrentlyPlayingChanged || place.playlist.currentSong >= place.playlist.songs.length || place.playlist.songs[place.playlist.currentSong].spotifySong.id !== currentlyPlaying.item.id) {
      let possibleIndexes = [];
      for (let i = 0; i < place.playlist.songs.length; i++) {
        if (currentlyPlaying.item.id === place.playlist.songs[i].spotifySong.id) {
          possibleIndexes.push(i);
        }
      }

      if (possibleIndexes.length < 1) { // Erroneous situation, update again soon to retry;
        console.log("Warning: Currently playing and playlist is not matching in Place: " + place._id);
        return 3 * 1000;
      }

      let updatedPlaylist = place.playlist;
      updatedPlaylist.currentSong = -1;
      if (possibleIndexes.length === 1) {
        updatedPlaylist.currentSong = possibleIndexes[0];
      }
      else {
        if (isCurrentlyPlayingChanged) { // Find next one coming after previous
          for (let i = possibleIndexes.length - 1; i >= 0; i--) {
            if (updatedPlaylist.currentSong < 0 || possibleIndexes[i] > place.playlist.currentSong) {
              updatedPlaylist.currentSong = possibleIndexes[i];
            }
          }
        }
        else { // Find closest
          let dist = updatedPlaylist.songs.length;
          for (let i = 0; i < possibleIndexes.length; i++) {
            if (Math.abs(possibleIndexes[i] - place.playlist.currentSong) < dist) {
              dist = Math.abs(possibleIndexes[i] - place.playlist.currentSong);
              updatedPlaylist.currentSong = possibleIndexes[i];
            }
          }
        }
      }

      updatedPlaylist.currentSongStartTime = new Date(Date.now() - currentlyPlaying.progress_ms);
      place.playlist = updatedPlaylist;
    }

    // Update voted songs if currently playing song has changed
    if (isCurrentlyPlayingChanged) {
      place.votedSongs = [
        place.playlist.songs[(place.playlist.currentSong + 1) % place.playlist.songs.length],
        place.playlist.songs[(place.playlist.currentSong + 2) % place.playlist.songs.length],
        place.playlist.songs[(place.playlist.currentSong + 3) % place.playlist.songs.length],
      ];
      place.votes = [0, 0, 0];
    }

    let votedSongIndexes = [];
    for (let i = 0; i < place.votedSongs.length; i++) {
      votedSongIndexes.push(-1);
      if (place.votedSongs[i].spotifySong.id !== place.playlist.songs[(place.playlist.currentSong + i) % place.playlist.songs.length].spotifySong.id) {
        // try to find new index
        for (let j = (place.playlist.currentSong + 1); (j % place.playlist.songs.length) !== place.playlist.currentSong; j++) {
          if (place.playlist.songs[(j % place.playlist.songs.length)].spotifySong.id === place.votedSongs[i].spotifySong.id) {
            votedSongIndexes[i] = j % place.playlist.songs.length;
            break;
          }
        }
      }
      else {
        votedSongIndexes[i] = (place.playlist.currentSong + i) % place.playlist.songs.length;
      }
    }

    // If playlist just started playing, replace invalid ones and fill voted songs
    let votes = place.votes;
    let votedSongs = place.votedSongs;
    if (isStartedPlaying) {
      for (let i = votedSongIndexes.length; i < 3; i++) {
        votedSongIndexes.push(-1);
      }

      for (let i = 0; i < votedSongIndexes.length; i++) {
        if (votedSongIndexes[i] < 0) {
          let isValid = false;
          let bestIndex = place.playlist.currentSong;
          while (!isValid) {
            bestIndex = (bestIndex + 1) % place.playlist.songs.length;
            isValid = true;
            for (let j = 0; j < votedSongIndexes.length; j++) {
              if (bestIndex === votedSongIndexes[j]) {
                isValid = false;
                break;
              }
            }
          }

          votedSongIndexes[i] = bestIndex;
          votedSongs[i] = place.playlist.songs[bestIndex];
          votes[i] = 0;
        }
      }
    }
    place.votedSongs = votedSongs;

    // Make sure that not valid voted songs do not win
    let invalidCount = 0;
    for (let i = 0; i < votedSongIndexes.length; i++) {
      if (votedSongIndexes[i] < 0) {
        invalidCount++;
        for (let j = 0; j < votedSongIndexes.length; j++) {
          if (votedSongIndexes[j] >= 0 && votes[i] > votes[j]) {
            votes[j] = votes[i] + 1;
          }
        }
      }
    }
    place.votes = votes;

    if (invalidCount === place.votedSongs.length) { // All invalid, clear arrays
      place.votedSongs = [];
      place.votes = [];
    }

    let remainingTime = place.playlist.songs[place.playlist.currentSong].duration - currentlyPlaying.progress_ms;
    if (remainingTime <= 10 * 1000) { // Voting has ended, update order if necessary
      if (place.votedSongs.length > 0) {
        let maxVote = -1;
        let winnerIndex = -1;
        for (let i = 0; i < place.votes.length; i++) {
          if (votedSongIndexes[i] >= 0 && place.votes[i] > maxVote) {
            maxVote = place.votes[i];
            winnerIndex = votedSongIndexes[i];
          }
        }

        if (winnerIndex < 0) { // Erroneous situation, update again soon to retry
          console.log("Warning: Not a valid vote found with valid voted songs in Place: " + place._id);
          return 3 * 1000;
        }

        if (winnerIndex !== (place.playlist.currentSong + 1)) { // Requires update
          let result = await spotifyController.reorderTrack(place.spotifyConnection, place.playlist.spotifyPlaylist, winnerIndex, place.playlist.currentSong);
          if (!result.success) {
            return  3 * 1000; // update again soon to retry
          }

          // update our copy too
          /*
          let isWinnerBefore = winnerIndex < place.playlist.currentSong;
          let songs = place.playlist.songs;
          let winner = songs.splice(winnerIndex, 1);
          songs.splice(isWinnerBefore ? place.playlist.currentSong : place.playlist.currentSong + 1, 0, winner);
          let updatedPlaylist = place.playlist;
          updatedPlaylist.songs = songs;
          updatedPlaylist.currentSong = isWinnerBefore ? updatedPlaylist.currentSong : updatedPlaylist.currentSong + 1;
          place.playlist = updatedPlaylist;
          */
        }
      }

      // Update again 5 seconds after new song starts
      return remainingTime + 5 * 1000;
    }
    else if (remainingTime <= 30 * 1000) {
      // Update in last 10 seconds
      return remainingTime - 9 * 1000;
    }

    // Update every 20 seconds
    return 20 * 1000;
  }
}

module.exports = new UpdateController();