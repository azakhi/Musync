import React, {Component} from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import footer from "./Footer";
import {Link} from "@material-ui/core";
import { placeCard, PlaceCardTypes } from "./Place/PlaceCard";


class Home extends Component {
  render() {
    const mainPlace = {
      id: 1,
      name: "Sun Brothers",
      image: "https://b.zmtcdn.com/data/pictures/6/6001836/cae7f24481e1128ac4070a67c26d4ba8_featured_v2.jpg",
      genres: ["Rock", "Metal"],
      currentSong: "Iron Maiden - Dance of Death"
    };
    
    const otherPlaces = [
      {
        id: 2,
        name: "Blue Jay",
        genres: ["Pop"],
        currentSong: "Taylor Swift - Shake it up"
      },
      {
        id: 3,
        name: "Mozart Cafe",
        genres: ["Classic"],
        currentSong: "Beethoven - Symphony No:9 in D minor"
      },
    ];
    
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        
        <br/>
        
        <Grid item xs={10}>
          <Typography variant="h2" align="center">
            <FontAwesomeIcon icon="guitar"/>
            Musync
          </Typography>
          
          <Typography align="center">
            Start listening what you want to listen
          </Typography>
        </Grid>
        
        <Grid container item xs={11}>
          {placeCard(mainPlace, PlaceCardTypes.HomeViewPrimary)}
        </Grid>
        
        <Grid container item xs={10} spacing={8} justify="center">
          <Typography gutterBottom align="center">
            {`Are you not in ${mainPlace.name}? Try these ones.`}
          </Typography>
          <br/>
          
          {otherPlaces.map(place => placeCard(place, PlaceCardTypes.HomeViewSecondary))}
        </Grid>
        
        <Grid item xs={12}>
          <Typography gutterBottom align="center">
            <Link href="#login-with-spotify">
              Login with your Spotify account
            </Link>
          </Typography>
          <Typography gutterBottom align="center">
            <Link href="#login-as-host">
              Login as a Host
            </Link>
          </Typography>
        </Grid>
  
        <Grid item xs={12}>
          {footer()}
        </Grid>
      
      </Grid>
    );
  }
}

export default Home;