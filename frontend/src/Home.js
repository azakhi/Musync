import React, {Component} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Grid from "@material-ui/core/Grid";
import {Link} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Footer from "./utils/Footer";
import PlaceCard, {PlaceCardTypes} from "./place/PlaceCard";


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
          <PlaceCard place={mainPlace} type={PlaceCardTypes.HomeViewPrimary}/>
        </Grid>
        
        <Grid container item xs={10} spacing={8} justify="center">
          <Typography gutterBottom align="center">
            {`Are you not in ${mainPlace.name}? Try these ones.`}
          </Typography>
          <br/>
          
          {renderOtherPlaces(otherPlaces)}
          
        </Grid>
        
        <Grid item xs={12}>
          <Typography gutterBottom align="center">
            <Link href="/login">
              Login
            </Link>
          </Typography>
          <Typography gutterBottom align="center">
            <Link href="/sign-up">
              Create an account
            </Link>
          </Typography>
        </Grid>
        
        <Footer/>
      
      </Grid>
    );
  }
}

function renderOtherPlaces(otherPlaces) {
  let counter = 0;
  
  return otherPlaces.map(place => {
    counter++;
    const key = 'placeCard_' + counter;
    
    return <PlaceCard place={place}
                      type={PlaceCardTypes.HomeViewSecondary}
                      key={key}/>
  });
}

export default Home;