import React, {Component} from "react";
import axios from "axios/index";

import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import Footer from "../utils/Footer";
import PlaceCard, {PlaceCardTypes} from "../place/PlaceCard";
import auth from "../auth/auth";
import {Heading} from "../utils/Heading";
import {ButtomLinks} from "./ButtomLinks";


class Home extends Component {
  
  constructor(props) {
    super(props);
    
    this.handleLogout = this.handleLogout.bind(this);
    
    auth.requestUserInfo()
      .then(() => {
        this.setState({
          authenticated: true,
          authUser: auth.getAuthUser()
        })
      })
      .catch(() => {
        this.setState({
          authenticated: false,
          authUser: null
        })
      });
    
    this.state = {
      authenticated: false,
      authUser: null,
      mainPlace: {
        id: 1,
        name: "",
        image: "/img",
        genres: [],
        currentSong: ""
      },
      otherPlaces: [{
        id: 2,
        name: "",
        genres: [],
        currentSong: ""
      }]
    };
  }
  
  componentWillMount() {
    // this.getLocation();
  }
  
  handleLogout() {
    this.setState({
      authenticated: false,
      authUser: null
    })
  }
  
  getLocation() {
    const geolocation = navigator.geolocation;
    return new Promise((resolve, reject) => {
      
      if (!geolocation) {
        reject(new Error('Not Supported'));
      }
      
      geolocation.getCurrentPosition(async (position) => {
        let closestPlaces = await this.sendCoords(position.coords.latitude,position.coords.longitude);
        var arr =[];
        for (var i = 0; i < closestPlaces.length; i++) {
          if(i === 0){
            this.setState({ mainPlace:{id: closestPlaces[i].id,
                name: closestPlaces[i].name,
                genres: closestPlaces[i].genres,
                currentSong: closestPlaces[i].currentlyPlaying
              }});
          }else{
            arr.push({
              id: closestPlaces[i].id,
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
  }
  
  sendCoords = async (latitude,longitude) => {
    let res = await axios.post("http://localhost:1234/place/closest", {latitude: latitude,longitude:longitude});
    return await res.data;
  };
  
  render() {
    const {authUser, authenticated} = this.state;
    
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        <br onLoad={() => this.sendCoords(this.props.coords.latitude, this.props.coords.longitude)}/>
        
        <Heading />
        
        {
          authUser &&
          <Typography align="center" variant="subtitle1" color="textPrimary">
            {`Welcome back ${authUser.name}!`}
          </Typography>
        }
        
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
        
        <ButtomLinks authenticated={authenticated}
                     handleLogout={this.handleLogout}/>
        
        <Footer/>
      
      </Grid>
    );
  }
}

function renderOtherPlaces(otherPlaces) {
  return otherPlaces.map((place, index) =>
    <PlaceCard place={place}
               type={PlaceCardTypes.HomeViewSecondary}
               key={index.toString()}/>
  );
}

export default Home;