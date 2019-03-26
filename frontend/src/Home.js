import React, {Component} from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import footer from "./Footer";
import {Link} from "@material-ui/core";


class Home extends Component {
  render() {
    const mainLocation = {
      name: "Sun Brothers",
      image: "https://b.zmtcdn.com/data/pictures/6/6001836/cae7f24481e1128ac4070a67c26d4ba8_featured_v2.jpg",
      genres: ["Rock", "Metal"],
      currentSong: "Iron Maiden - Dance of Death"
    };
    
    const otherLocations = [
      {
        name: "Blue Jay",
        genres: ["Pop"],
        currentSong: "Taylor Swift - Shake it up"
      },
      {
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
          {locationCard(mainLocation)}
        </Grid>
        
        <Grid container item xs={10} spacing={8} justify="center">
          <Typography gutterBottom align="center">
            {`Are you not in ${mainLocation.name}? Try these ones.`}
          </Typography>
          <br/>
          
          {otherLocations.map(location => locationCard(location))}
        </Grid>
        
        <Grid item xs={12} justify="center">
          <Typography gutterBottom align="center">
            <Link href="#">
              Login with your Spotify account
            </Link>
          </Typography>
          <Typography gutterBottom align="center">
            <Link href="#">
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


function locationCard(props) {
  const {name, image, genres, currentSong} = props;
  const isMain = image;
  
  return (
    <Grid item xs={12}>
      <Card square elevation={isMain ? 2 : 1}>
        {isMain && <CardMedia component="img"
                              alt={name + " image"}
                              image={image}
                              title={name + " image"}/>}
        
        <CardContent>
          <Typography variant="h5">
            {name}
          </Typography>
          <Typography>
            {"Genres: " + genres.join(", ")}
            <br/> <br/>
  
            <FontAwesomeIcon icon="music"/>
            {" Now Playing: " + currentSong}
          </Typography>
        </CardContent>
        
        <CardActions style={{justifyContent: 'center'}}>
          <Button color="primary"
                  size="small"
                  variant={isMain ? "contained" : "text"}>
            I am here!
          </Button>;
        </CardActions>
      </Card>
    </Grid>
  
  );
}

export default Home;