const assert = require('assert');
const models = require("../models/Models");
const spotifyController = require('./SpotifyController');


class UpdateController {
  static async updatePlaylist(place) {
  
    let oldPlaylist = place.playlist;
    let oldCurrentSong = oldPlaylist.currentSong;
    let oldcurrentSongStartTime = oldPlaylist.currentSongStartTime;
    let pl = await spotifyController.getPlaylist(place.spotifyConnection,oldPlaylist.spotifyPlaylist.id);
   
 
    // update playlist
    if (pl.success) {
      pl = pl.response;
      let songs = [];
      for (let track of pl.tracks.items) {
        let spotifyItem = new models.SpotifyItem({
          id: track.track.id,
          uri: track.track.uri,
          name: track.track.name,
        });
        let artistArray = [];
        for(const artist of track.track.artists){
          let artistName = artist.name;
          artistArray.push(artistName);
        }
        let trackAlbumImages = track.track.album.images;
        
        let song = new models.Song({
          songUri:trackAlbumImages?trackAlbum[0].url:"",
          artistName: artistArray,
          name: track.track.name,
          duration: track.track.duration_ms,
          spotifySong: spotifyItem,
        });
        songs.push(song);
      }
      
      let spotifyPlaylist = new models.SpotifyItem({
        id: pl.id,
        uri: pl.uri,
        name: pl.name,
        description: pl.description,
      });
      let playlist = new models.Playlist({
        songs: songs,
        spotifyPlaylist: spotifyPlaylist,
        currentSong: oldCurrentSong,
        currentSongStartTime: oldcurrentSongStartTime,
      });

      place.playlist = playlist;
  
    }
  
    let currentPlaylist = place.playlist;
    let songs = currentPlaylist.songs;
    
  
    //get current playing status
    let curPlaying = await spotifyController.getCurrentlyPlaying(place.spotifyConnection);
    if (!curPlaying.success) {
      return -1;
    }
    else { curPlaying = curPlaying.response }
    
    let context = (curPlaying.context && curPlaying.context.type === "playlist" && curPlaying.context.uri)
      ? curPlaying.context.uri.split(":").pop() : "";
    
      currentPlaylist.isPlaying = curPlaying.is_playing && curPlaying.currently_playing_type === "track" && context === currentPlaylist.spotifyPlaylist.id;
    
    if (currentPlaylist.isPlaying && curPlaying.item) {
      let currentSong = -1;
      for (let i = 0; i < currentPlaylist.songs.length; i++) {
        if (currentPlaylist.songs[i].spotifySong.id === curPlaying.item.id) {
          currentSong = i;
          break;
        }
      }
      
      currentPlaylist.currentSong = currentSong;
      if (currentSong >= 0 && curPlaying.timestamp && curPlaying.progress_ms) {
        currentPlaylist.currentSongStartTime = new Date(Date.now() - curPlaying.progress_ms);
      }
    }
  
    let currentSong = songs[currentPlaylist.currentSong];
    
  
  
  
  
    console.log(currentPlaylist.currentSongStartTime);
    if(currentSong.duration - (Date.now() - currentPlaylist.currentSongStartTime.getTime()) < 10000){
      let maxIndex = 0;
      let max = Number.NEGATIVE_INFINITY;
  
      let votedSongs =  place.votedSongs;
      let votes =  place.votes;
      let isPlaying =  place.playlist.isPlaying;
      let currentSong = (place.playlist.currentSong >= 0 && place.playlist.songs[place.playlist.currentSong]) ? place.playlist.songs[place.playlist.currentSong] : null;
      let currentSongStartTime= place.playlist.currentSongStartTime;
  
      for (let m = 0; m < votes.length; m++){
        if(max < votes[m]){
          max = votes[m];
          maxIndex = m;
        }
      }
      let selectedIndex = 0;
      for(let i = 0; i < place.playlist.songs.length; i++){
        if(place.playlist.songs[i].spotitifySong.id === votedSongs[maxIndex].spotitifySong.id){
          selectedIndex = i;
        }

      }
 
      let response = await spotifyController.reorderTrack(place.spotifyConnection,currentPlaylist.spotifyPlaylist,selectedIndex,currentPlaylist.currentSong);
      if(response.success){
        return 15000;
      }else{
        return 3000;
      }
      
    }
    let timeLeft = currentSong.duration - (Date.now() - currentPlaylist.currentSongStartTime.getTime());
    if( timeLeft <= 20000){
      return 5000;
    }else if(timeLeft < 40000){
      return timeLeft - 20000; 
    }else {
      return 20000;
    }
  }
}

module.exports = new UpdateController();