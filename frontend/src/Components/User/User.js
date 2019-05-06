import React, {Component} from 'react';
import {Link as RouterLink} from "react-router-dom";
import axios from "axios/index";
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
import withAuth from "../../auth/withAuth";
import {GET_RECOMMENDED_PLACES} from "../../config";
import Map2 from "../Places/Map2";
import {MAP_API_KEY} from "../../config";

class User extends Component {
  constructor(props) {

    super(props);
    this.requestRecommendedPlaces=this.requestRecommendedPlaces.bind(this);
    this.state = {
      userLocation: { lat: 32, lng: 32 },
      visitedPlaces: [],
      requestedSongs: [],
      recommendedPlaces : [],
      loading:false
    };
    
  }
  
  componentDidMount() {
    const { requestUserInfo, match } = this.props;
    const userId = match.params.id;
    requestUserInfo(userId);
    this.requestRecommendedPlaces(userId);
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
      this.setState({
        userLocation: { lat: latitude, lng: longitude },
        loading: false
      });
    },
    () => {
      this.setState({ loading: false });
      }
    );
    }
  
  requestRecommendedPlaces(userId){
    let url = GET_RECOMMENDED_PLACES;
    axios.get(url+"?userId="+userId).then((response)=>{

      this.setState({recommendedPlaces: response.data.result});
      console.log(this.state);
    });

  };
  
  render() {
    const buttonStyle = {
      display: "inline-block",
      margin: "5px"
    };
    
    const { user, isAuthenticated, authUser, match} = this.props;
    const isProfileOwner = (isAuthenticated && user && authUser._id === match.params.id);
    
    return (
      <Grid container
            alignItems="center"
            direction="row"
            justify="center"
            spacing={32}
            style={{marginTop: "2%"}}>
        
        <Navbar/>
        
        {
          user &&
          <Grid container item xs={12} md={9} style={{marginLeft: "5%"}} justify="center">
            <Grid item xs={10}>
              <Typography variant="h5">
                <FontAwesomeIcon icon="user"/>
                {` ${user.name} · ${Math.ceil(user.points)} points`}
              </Typography>
            </Grid>
            
            <Grid item xs={10} style={{marginTop: "3%"}}>
              <Typography variant="body2">
                Visited Places
              </Typography>
              
              <List dense>
                {getVisitedPlaces(user.visitedPlaces)}
              </List>
            </Grid>
            
            <Grid item xs={10} style={{marginTop: "3%"}}>
              <Typography variant="body2">
                Song Requests
              </Typography>
              
              <List dense>
                {getRequestedSongs(user.requestedSongs)}
              </List>
            </Grid>
            
            <Grid item xs={10} style={{marginTop: "3%"}}>
              <Typography variant="body2">
                Recommended Places
              </Typography>
              
              <List dense>
                {getRecommendedPlaces(this.state.recommendedPlaces,this.state.userLocation)}
              </List>
            </Grid>
          </Grid>
        }
        
        {
          isProfileOwner &&
          <Grid item xs={12} style={{textAlign: "center"}}>
            <Button href="/create-place"
                    variant="contained"
                    color="primary"
                    style={buttonStyle}>
              <FontAwesomeIcon icon="plus"/>&nbsp;
              Create a new Place
            </Button>
            <br/>
            <Button href="/user/settings"
                    variant="contained"
                    color="primary"
                    style={buttonStyle}>
              <FontAwesomeIcon icon="sliders-h"/>&nbsp;
              Settings
            </Button>
  
            <Typography gutterBottom align="center" style={{marginTop: "10px"}}>
              <Link component={RouterLink}
                    to="/logout"
                    onClick={() => this.props.logout()}
                    children="Logout" />
            </Typography>
          </Grid>
        }
        
        <Footer style={{position: "fixed", bottom: "1%"}}/>
      
      </Grid>
    );
  }
}

function getVisitedPlaces(places) {
  if(!places || places.length === 0)
    return <Typography gutterBottom variant="body1">
      No place has been visited so far.
    </Typography>;
  
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
  if(!songs || songs.length === 0)
    return <Typography gutterBottom variant="body1">
      No song request has been made so far.
  </Typography>;
  
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

function getRecommendedPlaces(places, location) {
  if(!places || places.length === 0)
    return <Typography gutterBottom variant="body1">
      We need more time to recommend you a new place.
    </Typography>;
  
  
  return <Map2
    places={places}
    initialCenter={location}
    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
    loadingElement={<div align="center" style={{ height: `100%` }} />}
    containerElement={<div align="center" style={{ height: `100%`, width: `100%` }} />}
    mapElement={<div align="center" style={{ height: '50vh', width:'80vw' }} />}
  />;
}

export default withAuth(User, 'user');
