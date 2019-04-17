import React, {Component} from 'react';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {Link} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Header from "./Header";


class User extends Component {
  render() {
    
    const currentUser = {
      name: "Dr. Ecnebi",
      points: 1700,
      visitedPlaces: [
        {name: "Orta Dünya", visitNum: 7},
        {name: "Death Star", visitNum: 1},
        {name: "Ot", visitNum: 3}],
      recommendedPlaces: [
        {name: "HellN", genres: ["Metal"]},
        {name: "Bilka", genres: ["Arabesk"]},
        {name: "Sweet", genres: ["Rap", "Hiphop"]}],
      songRequestHistory: [
        {name: "Fuel", artistName: "Metallica", placeName: "Orta Dünya"},
        {name: "Mutter", artistName: "Rammstein", placeName: "Death Star"},
        {name: "Lose Yourself", artistName: "Eminem", placeName: "Death Star"},
        {name: "Hello", artistName: "Adele", placeName: "Ot"},
        {name: "Bohemian Rhapsody", artistName: "Queen", placeName: "Ot"}]
    };
    
    return (
      <Grid container
            alignItems="center"
            direction="row"
            justify="center"
            spacing={32}
            style={{marginTop: "2%"}}>
        
        <Header isPlaceHeader={false}/>
        
        <Grid item xs={10}>
          <Typography variant="h5">
            <FontAwesomeIcon icon="user"/>
            {` ${currentUser.name} · ${currentUser.points} points`}
          </Typography>
        </Grid>
        
        <Grid item xs={10}>
          <Typography variant="body2">
            Visited Places
          </Typography>
          
          <List dense>
            {getVisitedPlaces(currentUser.visitedPlaces)}
          </List>
        </Grid>
        
        <Grid item xs={10}>
          <Typography variant="body2">
            Song Requests
          </Typography>
          
          <List dense>
            {getRequestedSongs(currentUser.songRequestHistory)}
          </List>
        </Grid>
  
        <Grid item xs={10}>
          <Typography variant="body2">
            Recommended Places
          </Typography>
    
          <List dense>
            {getRecommendedPlaces(currentUser.recommendedPlaces)}
          </List>
        </Grid>
        
        <Grid item xs={12}>
          <Typography gutterBottom align="center">
            <Link href="#spotify-account">
              Spotify Account
            </Link>
            {" | "}
            <Link href="#settings">
              Settings
            </Link>
            {" | "}
            <Link href="#logout">
              Logout
            </Link>
          </Typography>
        </Grid>
        
      </Grid>
    );
  }
}

function getVisitedPlaces(places) {
  let counter = 0;
  return places.map(place => {
    const placeName = place.name;
    const numberOfVisits = place.visitNum;
    counter++;
    
    return <ListItem key={counter} disableGutters>
      <ListItemIcon>
        <FontAwesomeIcon icon="glass-martini"/>
      </ListItemIcon>
      <ListItemText primary={placeName + " · " + numberOfVisits + " times"}/>
    </ListItem>;
  });
}

function getRequestedSongs(songs) {
  let counter = 0;
  return songs.map(song => {
    const artistName = song.artistName;
    const songName = song.name;
    const placeName = song.placeName;
    counter++;
    
    return <ListItem key={counter} disableGutters>
      <ListItemText primary={artistName + " - " + songName} secondary={placeName}/>
    </ListItem>;
  });
}

function getRecommendedPlaces(places) {
  let counter = 0;
  return places.map(place => {
    const placeName = place.name;
    const placeGenres = place.genres;
    counter++;
    
    return <ListItem key={counter} disableGutters>
      <ListItemIcon>
        <FontAwesomeIcon icon="glass-martini"/>
      </ListItemIcon>
      <ListItemText primary={placeName + " · " + placeGenres.join(', ')}/>
    </ListItem>;
  });
}

export default User;