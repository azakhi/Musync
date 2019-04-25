const express = require('express');
const router = express.Router();
const models = require("../models/Models");
const DBObjectBase = require("../models/DBObjectBase");
const DBBasicTypes = require("../models/DBBasicTypes");
const SpotifyItem = require("../models/SpotifyItem");
router.get('/', createPlaces);

async function createPlaces(req, res, next) {

  const placeNames = ["Crazyplay","Knight Metal","The Hairy Surgeons's Club","Hairy Knight","Between the Men and Me","Donald's Hairy Knight","Four Inch Men","Flight of the Pink Ostriches","Undercover Knight and the Crazy Men","Men for the Surgeons","The Snuggling Men","Saving Donald","They Might Be Hairy Ostriches","The Snuggling Elbows","The Snuggling Crazy Surgeons","Knight Attack","Mars Thunder Elbows","Snuggling for the Crazy Woman","Knightback","The Crazy Donald Project","Snuggling Dolls","Snuggling at the Disco","Limp Knight","Super Crazy Ostriches","Knight, Men and Ostriches","Letters From Donald of the Ostriches","Das Knight","Les Men","Twilight of the Knight Gods","Hairy Ostriches Dream","This Knight"];
  let latitudes = [];
  let longitudes = [];
  let center = {latitude: 39.870412699999996,longitude: 32.7493845};
  let radius = 10000;
  let genres_list = ["Blues","Classic Rock","Country","Dance","Disco","Funk","Grunge",
      "Hip-Hop","Jazz","Metal","New Age","Oldies","Other","Pop","R&B",
      "Rap","Reggae","Rock","Techno","Industrial","Alternative","Ska",
      "Death Metal","Pranks","Soundtrack","Euro-Techno","Ambient",
      "Trip-Hop","Vocal","Jazz+Funk","Fusion","Trance","Classical",
      "Instrumental","Acid","House","Game","Sound Clip","Gospel",
      "Noise","AlternRock","Bass","Soul","Punk","Space","Meditative",
      "Instrumental Pop","Instrumental Rock","Ethnic","Gothic",
      "Darkwave","Techno-Industrial","Electronic","Pop-Folk",
      "Eurodance","Dream","Southern Rock","Comedy","Cult","Gangsta",
      "Top 40","Christian Rap","Pop/Funk","Jungle","Native American",
      "Cabaret","New Wave","Psychadelic","Rave","Showtunes","Trailer",
      "Lo-Fi","Tribal","Acid Punk","Acid Jazz","Polka","Retro",
      "Musical","Rock & Roll","Hard Rock","Folk","Folk-Rock",
      "National Folk","Swing","Fast Fusion","Bebob","Latin","Revival",
      "Celtic","Bluegrass","Avantgarde","Gothic Rock","Progressive Rock",
      "Psychedelic Rock","Symphonic Rock","Slow Rock","Big Band",
      "Chorus","Easy Listening","Acoustic","Humour","Speech","Chanson",
      "Opera","Chamber Music","Sonata","Symphony","Booty Bass","Primus",
      "Porn Groove","Satire","Slow Jam","Club","Tango","Samba",
      "Folklore","Ballad","Power Ballad","Rhythmic Soul","Freestyle",
      "Duet","Punk Rock","Drum Solo","Acapella","Euro-House","Dance Hall"];
  for (var i = 0; i < genres_list.length; i++){
      let genre = new models.Genre({name:genres_list[i]});
      await genre.commitChanges();
  }
  
  for (var i = 0; i < 31; i++) { 
    var y0 = center.latitude;
    var x0 = center.longitude;
    var rd = radius / 111300;

    var u = Math.random();
    var v = Math.random();

    var w = rd * Math.sqrt(u);
    var t = 2 * Math.PI * v;
    var x = w * Math.cos(t);
    var y = w * Math.sin(t);

    
    latitudes.push(y + y0);
    longitudes.push(x + x0);
  }
  for (var i = 0; i < 31; i++) { 

    let placeName = placeNames[i];
    let latitude  = latitudes[i];
    let longitude = longitudes[i];
    let spotifyInfo = {id:"1",uri:"1",name:"1",description:"1",accessToken:"1",refreshToken:"1",expiresIn:1};
    let isPermanent = true;
    let district ="ankara";
    let city="ankara";
    let country="turkey";
    const {id, uri, name, description,
        accessToken, refreshToken, expiresIn} = spotifyInfo;
    
    let songs_list = ["Dangerous Protest","The Unremarkable Fair","Everybody Wilds On Savior","We Talks They","Savannah Like the Challenges","The Storey Waited","Snickering Lover","Eat Path","Swift Season","Oh Baby","Soundwaves","At The Tantric Pictures","Sexuality Loves Without a Sky","Brothers Like Elite","The Refined Tsar","The Hand of Opinion","The Rose's Healing","Flying Reply Comrade","Farewell Whispering","Beyond Nobody Sweet Child","Exploding Factorys","Unremarkable","Merry Forever","The Anxious Messenger","Nobody Sends Beyond Oddities","It Hopes Its","Birch On the Abyss","The Spirit Put","Proselytizing Fellow","Understand Song","Wild Angst","Work","Directon","Beyond The Frozen Past","Painter Waiteds In a Writer","Role On Scent","The Green Home","The Play House of Tree","The Opus's Shores","Epitaphs Pay Dreams","Souls Slaughtering","After It Slumber","Soaring Mistakes","Healthy"]
    let n =  Math.floor(Math.random() * Math.floor(6))+1;
    let genress = genres_list.sort(() => .5 - Math.random()).slice(0,n);
    let genres = [];
    if(Array.isArray(genress)){
      for(const genreName of genress){
        let genre = await models.Genre.findOne({name: genreName});
        genres.push(genre._id);
      }
    }
    
    
    let spotifyItem =await new models.SpotifyItem({
      id: id,
      uri: uri,
      name: name,
      description: description
    });
    
    let spotifyConnection =await new models.SpotifyConnection({
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresIn: expiresIn
    });
    let n_2 =  Math.floor(Math.random() * Math.floor(10))+1;
    let songs = songs_list.sort(() => .5 - Math.random()).slice(0,n_2);
    songs_arr = [];
    for (var j = 0; j < songs.length; j++) { 
      let song = new models.Song();
      let n =  Math.floor(Math.random() * Math.floor(2))+1;
      let genress = genres_list.sort(() => .5 - Math.random()).slice(0,n);
      let genres = [];
      if(Array.isArray(genress)){
        for(const genreName of genress){
          let genre = await models.Genre.findOne({name: genreName});
          genres.push(genre._id);
        }
      }
      let spotifyItem = new models.SpotifyItem();
      spotifyItem.name = songs[j];
      song.name=songs[j];
      song.genres = genres;
      song.spotifySong = spotifyItem;
      songs_arr.push(song);
    } 
    
    let playlist = await new models.Playlist({
      songs: songs_arr,
      currentSong: 0,
      currentSongStartTime: 0,
      spotifyPlaylist: spotifyItem
    });
    
    let location = await new models.Location({
      latitude: latitude,
      longitude: longitude,
      district: district,
      city: city,
      country: country,
    });
    
    let place = await new models.Place({
      name: placeName,
      pin: 1994,
      playlist: playlist,
      genres: genres,
      votes: [],
      votedSongs: [],
      songRecords: [],
      spotifyConnection: spotifyConnection,
      location: location,
      isPermanent: !!isPermanent,
    });
    await place.commitChanges();
  }
  
  
      
  
  
  res.status(200).json({});
}
module.exports = router;