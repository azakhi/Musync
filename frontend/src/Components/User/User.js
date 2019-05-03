import React, {Component} from 'react';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Grid from "@material-ui/core/Grid/index";
import List from "@material-ui/core/List/index";
import ListItem from "@material-ui/core/ListItem/index";
import ListItemIcon from "@material-ui/core/ListItemIcon/index";
import ListItemText from "@material-ui/core/ListItemText/index";
import {Link} from "@material-ui/core";
import Typography from "@material-ui/core/Typography/index";
import Navbar from "../Utils/Navbar";
import Footer from "../Utils/Footer";
import Button from "@material-ui/core/Button/index";
import axios from "axios/index"
import {SERVER_DOMAIN} from "../../config";


class User extends Component {
  constructor(props) {
		super(props);
		this.state = {
		    visitedPlaces: [],
        requestedSongs: []
    };
	}

	componentDidMount() {
    const url = SERVER_DOMAIN + "/user/gethistory";
    let self = this;
    axios.get(url)
      .then(function (response) {
        if( response.status === 200 ){
          self.setState({ visitedPlaces: response.data.resultPlaces});
          self.setState({ requestedSongs: response.data.resultSongs});
        }
        else if( response.status === 204 ){
          window.location.href = "/../login";
        }
      })
      .catch(function (error) {
        console.log(error);
      });
	}

  render() {
    const currentUser = {
      name: "Dr. Ecnebi",
      points: 1700,
      recommendedPlaces: [
        {name: "HellN", genres: ["Metal"]},
        {name: "Bilka", genres: ["Arabesk"]},
        {name: "Sweet", genres: ["Rap", "Hiphop"]}]
    };

    const buttonStyle = {
      display: "inline-block",
      margin: "5px"
    };

    return (
      <Grid container
            alignItems="center"
            direction="row"
            justify="center"
            spacing={32}
            style={{marginTop: "2%"}}>

        <Navbar/>

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
            {getVisitedPlaces(this.state.visitedPlaces)}
          </List>
        </Grid>

        <Grid item xs={10}>
          <Typography variant="body2">
            Song Requests
          </Typography>

          <List dense>
            {getRequestedSongs(this.state.requestedSongs)}
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

        <Grid item xs={12} style={{textAlign: "center"}}>
          <Button href="/create-place"
                  variant="contained"
                  color="primary"
                  style={buttonStyle}>
            <FontAwesomeIcon icon="plus"/>&nbsp;
            Create a new Place
          </Button>
          <br/>
          <Button href="/settings"
                  variant="contained"
                  color="primary"
                  style={buttonStyle}>
            <FontAwesomeIcon icon="sliders-h"/>&nbsp;
            Settings
          </Button>

          <Typography gutterBottom align="center" style={{marginTop: "10px"}}>
            <Link href="#logout">
              Log out
            </Link>
          </Typography>
        </Grid>

        <Footer/>

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
