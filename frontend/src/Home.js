import React, {Component} from "react";
import { Link as RouterLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Grid from "@material-ui/core/Grid";
import {Link} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Footer from "./utils/Footer";
import PlaceCard, {PlaceCardTypes} from "./place/PlaceCard";
import axios from "axios";


// Redux Action Types
const GET_LOCATION = 'GET_LOCATION';


class Home extends Component {

    state = { mainPlace: {
      id: 1,
      name: "",
      image: "",
      genres: [],
      currentSong: ""
    }, otherPlaces: [
      {
        id: 2,
        name: "",
        genres: [],
        currentSong: ""
      },
      ] };
    
  
       getLocation =  () => {

        
        const geolocation = navigator.geolocation;
        
        const location = new Promise((resolve, reject) => {
          if (!geolocation) {
           
            reject(new Error('Not Supported'));
          }
          
          geolocation.getCurrentPosition(async (position) => {
            
            let closestPlaces = await this.sendCoords(position.coords.latitude,position.coords.longitude);
            var arr =[];
            for (var i = 0; i < closestPlaces.length; i++) { 
              if(i==0){
                
                this.setState({mainPlace:{id: closestPlaces[i].id,
                  name: closestPlaces[i].name,
                  genres: closestPlaces[i].genres,
                  currentSong: closestPlaces[i].currentlyPlaying
                  
                
              }});
                 
              }else{
                arr.push({id: closestPlaces[i].id,
                  name: closestPlaces[i].name,
                  genres: closestPlaces[i].genres,
                  currentSong: closestPlaces[i].currentlyPlaying
                  
                
              });
                
              }
              
            }
            this.setState({otherPlaces:arr});
          }, () => {
            reject (new Error('Permission denied'));
          });
        });
        
        
      };
  sendCoords = async (latitude,longitude) => {
    
    let res = await axios.post("http://localhost:1234/place/closest", { latitude: latitude,longitude:longitude});
    let  data  = await res.data;
    return data;
};
componentWillMount() {
  
  this.getLocation();
}
  render() {
    
 
    
    return (
     
      <Grid onLoad={this.findCoordinates} container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        <br onLoad={()=>this.sendCoords(this.props.coords.latitude,this.props.coords.longitude)}></br>
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
          <PlaceCard place={this.state.mainPlace} type={PlaceCardTypes.HomeViewPrimary}/>
        </Grid>
        
        <Grid container item xs={10} spacing={8} justify="center">
          <Typography gutterBottom align="center">
            {`Are you not in ${this.state.mainPlace.name}? Try these ones.`}
          </Typography>
          <br/>
          
          {renderOtherPlaces(this.state.otherPlaces)}
          
        </Grid>
        
        <Grid item xs={12}>
          <Typography gutterBottom align="center">
          <Link component={RouterLink}
                  to={{
              pathname: "/login",
              state: { from: window.location.pathname } }}>
              Login
            </Link>
          </Typography>
          <Typography gutterBottom align="center">
          <Link component={RouterLink}
                  to={{
              pathname: "/register",
              state: { from: window.location.pathname } }}>
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