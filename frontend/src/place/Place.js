import React, {Component} from "react";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Footer from "../utils/Footer";
import Header from "../utils/Header";
import PlaceCard, {PlaceCardTypes} from "./PlaceCard";
import Playlist from "./Playlist";


class Place extends Component {
  render() {
    const currentPlace = {
      id: 1,
      name: "Sun Brothers",
      image: "https://b.zmtcdn.com/data/pictures/6/6001836/cae7f24481e1128ac4070a67c26d4ba8_featured_v2.jpg",
      genres: ["Rock", "Metal"],
      currentSong: "Iron Maiden - Dance of Death"
    };
    const songs = [
      {name: "To Live Is To Die", artist: "Metallica", length: 9.48},
      {name: "Highway to Hell", artist: "AC/DC", length: 3.28},
      {name: "Holy Diver", artist: "Dio", length: 5.40},
      {name: "The Trooper", artist: "Iron Maiden", length: 4.12},
      {name: "One", artist: "Metallica", length: 7.27},
      {name: "Ace of Spades", artist: "Motörhead", length: 2.45}
    ];
    
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
    
        <br/>
        
        <Header isPlaceHeader={true}/>
        
        <Grid container item xs={11}>
          <PlaceCard place={currentPlace} type={PlaceCardTypes.PlaceView}/>
        </Grid>
        
        <Grid item xs={12} style={{textAlign: 'center'}}>
          <Typography align="center" variant="h5" gutterBottom>
            Play Queue
          </Typography>
          
          <Playlist songs={songs}/>
          
          <br/>
          <Button variant="contained"
                  color="primary"
                  style={{marginBottom: "50px"}}
                  onClick={()=>console.log("Add song!")}>
            Add Song!
          </Button>
        </Grid>
        
        <Footer/>
  
      </Grid>
    );
  }
}

export default Place;