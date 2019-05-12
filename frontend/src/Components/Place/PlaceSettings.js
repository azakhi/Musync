import React, {Component} from "react";
import axios from "axios";

import Button from "@material-ui/core/Button/index";
import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import TextField from "@material-ui/core/TextField/index";
import Footer from "../Utils/Footer";
import {SERVER_DOMAIN} from "../../config";
import Map from "./Map";
import GenrePicker from "./GenrePicker";
import withAuth from "../../auth/withAuth";
import history from "../../utils/history";
import Navbar from "../Utils/Navbar";


class PlaceSettings extends Component {
  constructor(props) {
    super(props);
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.placeMarkerAndPanTo = this.placeMarkerAndPanTo.bind(this);
    this.handleChange = this.handleChange.bind(this);
    
    this.state = {
      selectedOption: [],
      placeInitialized: false,
      name: "",
      pin: "",
      location:{
        latitude: 36,
        longitude: 36,
        city:"",
        country:""
      }
    };
  }
  
  componentDidMount() {
    const {match} = this.props;
    const placeId = match.params.id;
    
    this.props.requestPlaceInfo(placeId);
  }
  
  componentWillReceiveProps(nextProps, nextContext) {
    if(!this.state.placeInitialized && nextProps.place){
      let options = [];
      if(nextProps.place.genres)
        options = nextProps.place.genres.map(genre => {return {value: genre, label: genre} });
      
      this.setState({
        name: nextProps.place.name,
        selectedOption: options,
        placeInitialized: true,
        location: nextProps.place.location
      })
    }
  }
  
  placeMarkerAndPanTo(latLng, map, marker){
    marker.setPosition(latLng);
  }
  
  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    const {place} = this.props;
    if(!place)
      return;
    
    const url = SERVER_DOMAIN + "/place/change";
    let genres = [];
    for(const item of this.state.selectedOption){
      genres.push(item.value);
    }
    
    const body = {
      placeId: place._id,
      name: this.state.name,
      genres: genres,
      location: this.state.location
    };
    axios.post(url, body);
  }
  
  handleChange (selectedOption) {
    this.setState({
      selectedOption: selectedOption
    });
  };
  
  
  render() {
    const location = {
      lat: this.state.location.latitude,
      lng: this.state.location.longitude
    };
    
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        
        <Navbar />
        
        <Grid item xs={10} style={{textAlign: 'center'}}>
          
          <Typography variant="h5"
                      color="textPrimary">
            Settings
          </Typography>
          
          <TextField id="name"
                     label="Name"
                     value={this.state.name}
                     onChange={this.handleInputChange}
                     style={{ margin: 8 }}
                     placeholder="Change name..."/>
          <br/>
          
          <TextField id="pin"
                     label="Pin"
                     value={this.state.pin}
                     onChange={this.handleInputChange}
                     style={{ margin: 8 }}
                     placeholder="Change pin..."/>
          <br/>
          
          <GenrePicker onChange={this.handleChange} value={this.state.selectedOption}/>
  
          <Typography variant="body1"
                      color="textPrimary" align="left">
            Change location
          </Typography>
          
          <Map
            id="myMap"
            options={{
              center: location,
              zoom: 15,
              disableDefaultUI: true
            }}
            onMapLoad={map => {
              let markers = [];
              let marker = new window.google.maps.Marker({
                position: location,
                map: map,
                title: 'Hello Istanbul!'
              });
      
              markers.push(marker);
              let input = document.getElementById('pac-input');
              let searchBox = new window.google.maps.places.SearchBox(input);
              map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(input);
      
              // Bias the SearchBox results towards current map's viewport.
              map.addListener('bounds_changed', ()=> {
                searchBox.setBounds(map.getBounds());
              });
              // Listen for the event fired when the user selects a prediction and retrieve
              // more details for that place.
              searchBox.addListener('places_changed', async () => {
                let places = searchBox.getPlaces();
                if (places.length === 0) {
                  return;
                }
                // Clear out the old markers.
                markers.forEach(function(marker) {
                  marker.setMap(null);
                });
                markers = [];
                // For each place, get the icon, name and location.
                let bounds = new window.google.maps.LatLngBounds();
                places.forEach(function(place) {
                  if (!place.geometry) {
                    console.log("Returned place contains no geometry");
                    return;
                  }
                  // Create a marker for each place.
                  markers.push(new window.google.maps.Marker({
                    map: map,
                    title: place.name,
                    position: place.geometry.location
                  }));
                  if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                  } else {
                    bounds.extend(place.geometry.location);
                  }
                });
        
                let geocoder = new window.google.maps.Geocoder();
                let country = "";
                let city = "";
                await geocoder.geocode({
                  'latLng': markers[0].position
                }, (results, status) => {
                  if (status === window.google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
              
                      for(const comp of results[0].address_components){
                        if (comp.types[0] === "administrative_area_level_1"){
                          city = comp.long_name;
                  
                        }
                        if (comp.types[0] === "country"){
                          country = comp.long_name;
                        }
                      }
                      let loc_state = markers[0].position;
                      this.setState({
                        location:{
                          latitude: loc_state.lat(),
                          longitude: loc_state.lng(),
                          city: city,
                          country: country
                        }});
                    }
                  }
                });
                map.fitBounds(bounds);
              });
              map.addListener('click', async (e) => {
                await this.placeMarkerAndPanTo(e.latLng, map,markers[0]);
                const geocoder = new window.google.maps.Geocoder();
                let country = "";
                let city = "";
                geocoder.geocode({
                  'latLng': markers[0].position
                },  (results, status) => {
                  if (status === window.google.maps.GeocoderStatus.OK) {
                    if (results[0]) {
              
                      for(const comp of results[0].address_components){
                        if (comp.types[0] === "administrative_area_level_1"){
                          city = comp.long_name;
                        }
                        if (comp.types[0] === "country"){
                          country = comp.long_name;
                        }
                      }
                      const loc_state = markers[0].position;
                      this.setState({location:{
                          latitude:loc_state.lat(),
                          longitude:loc_state.lng(),
                          city:city,
                          country:country
                        }});
                    }
                  }
                });
              });
            }}
          />
          <input id="pac-input" className="controls" type="text" placeholder="Search Box"/>
  
          <br/>
          <Button variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}>
            Apply
          </Button>
          <br/>
          <Button variant="text"
                  color="primary"
                  onClick={() => history.goBack()}>
            Go back
          </Button>
          
          
        </Grid>
        
        <Footer />
      
      </Grid>
    );
  }
}
export default withAuth(PlaceSettings);