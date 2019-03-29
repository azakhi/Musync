import React, {Component} from "react";

import Grid from "@material-ui/core/Grid";
import footer from "../Footer";
import header from "../Header";
import {placeCard, PlaceCardTypes} from "./PlaceCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";


class Place extends Component {
  render() {
    const location = {
      id: 1,
      name: "Sun Brothers",
      image: "https://b.zmtcdn.com/data/pictures/6/6001836/cae7f24481e1128ac4070a67c26d4ba8_featured_v2.jpg",
      genres: ["Rock", "Metal"],
      currentSong: "Iron Maiden - Dance of Death"
    };
    
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
    
        <br/>
        
        {header({isPlaceHeader: true})}
        
        <Grid container item xs={11}>
          {placeCard(location, PlaceCardTypes.PlaceView)}
        </Grid>
        
        <Grid item xs={12} style={{textAlign: 'center'}}>
          <Typography align="center" variant="h5" gutterBottom>
            Play Queue
          </Typography>
          
          <List dense>
            {generatePlayQueue()}
          </List>
          
          <Button variant="contained"
                  color="primary"
                  style={{marginBottom: "50px"}}
                  onClick={()=>console.log("Add song!")}>
            Add Song!
          </Button>
        </Grid>
        
        <Grid item xs={12}>
          {footer()}
        </Grid>
  
      </Grid>
    );
  }
}

function generatePlayQueue(){
  const songs = [
    {name: "To Live Is To Die", artist: "Metallica", length: 9.48},
    {name: "Highway to Hell", artist: "AC/DC", length: 3.28},
    {name: "Holy Diver", artist: "Dio", length: 5.40},
    {name: "The Trooper", artist: "Iron Maiden", length: 4.12},
    {name: "One", artist: "Metallica", length: 7.27},
    {name: "Ace of Spades", artist: "Motörhead", length: 2.45}
  ];
  let counter = 0;
  return songs.map(song => {
    counter++;
    return <ListItem key={counter}>
      <IconButton color="secondary" onClick={()=> console.log("Add " + song.name)}>
        <FontAwesomeIcon  icon="plus" size="xs"/>
      </IconButton>
      
      <ListItemText>
        <Typography variant="body2" align="left" >
          {song.artist + " - " + song.name + " · " + song.length}
        </Typography>
      </ListItemText>
      
      <ListItemSecondaryAction>
        <IconButton color="secondary" onClick={()=> console.log("Upvote " + song.name)}>
          <FontAwesomeIcon  icon="arrow-up" size="xs"/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>;
  });
}

export default Place;