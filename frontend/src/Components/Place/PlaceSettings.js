import React, {Component} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Button from "@material-ui/core/Button/index";
import Chip from "@material-ui/core/Chip/index";
import CircularProgress from "@material-ui/core/CircularProgress/index";
import Grid from "@material-ui/core/Grid/index";
import Link from "@material-ui/core/Link/index";
import Typography from "@material-ui/core/Typography/index";
import TextField from "@material-ui/core/TextField/index";
import auth from "../../auth/auth";
import Footer from "../Utils/Footer";
import {generateSpotifyAuthURL} from "../../config";
import {generateStateParamCookie, setNextAndCurrPathCookies} from "../../utils/utils";
import {Heading} from "../Utils/Heading";
import Map from "./Map";
import axios from "axios/index";
import {SERVER_DOMAIN} from "../../config";

import Select from 'react-select';
 const colourOptions = [
    { value: 'Blues', label: 'Blues' },
    { value: 'Classic Rock', label: 'Classic Rock'},
    { value: 'Dance', label: 'Dance'},
    { value: 'Funk', label: 'Funk'},
    { value: 'Pop', label: 'Pop'},
    { value: 'Rock', label: 'Rock'},
    { value: 'Punk', label: 'Punk' },
    { value: 'forest', label: 'Forest' },
    { value: 'Soul', label: 'Soul'},
    { value: 'Classical', label: 'Classical' },
  ];


class PlaceSettings extends Component {
  constructor(props) {
    super(props);
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.placeMarkerAndPanTo = this.placeMarkerAndPanTo.bind(this);
    
    
  
    this.state = {
      selectedOption: [],
      name: "",
      location:{
        latitude:"",
        longitude:"",
        city:"",
        country:""
        }
    };
  }
  placeMarkerAndPanTo(latLng, map,marker){
    marker.setPosition(latLng);
   
  }
  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
    
  }
  
  handleSubmit(event) {
    const url = SERVER_DOMAIN + "/place/change";
    let genres = [];
    for(const item of this.state.selectedOption){
      genres.push(item.value);
    }
    
    const body = {
      placeId: "5cc1b6629373121b2f0e11ae",
      name: this.state.name,
      genres: genres,
      location: this.state.location
    };
    axios.post(url, body);
    
    
    
    
    
   
  }
  handleChange = (selectedOption,callback) => {
    
    this.setState({ selectedOption });
    
  
  }
  
  
  render() {
    const {loading, error, errorMsg, success, stateParam, spotifyDenied} = this.state;
    const errorIcon = <FontAwesomeIcon icon={"exclamation-triangle"}/>;
    const successIcon = <FontAwesomeIcon icon={"check-circle"}/>;
    const spotifyAuthURL = generateSpotifyAuthURL(stateParam);
  
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        
        <Heading />
        
        
        <Grid item xs={12} style={{textAlign: 'center'}}>
        
          <Typography variant="h5"
                      color="textPrimary">
            Settings
          </Typography>
          

          <input id="pac-input" className="controls" type="text" placeholder="Search Box"></input>
        <Map
          id="myMap"
          options={{
            center: { lat: 41.0082, lng: 28.9784 },
            zoom: 8
          }}
          onMapLoad={map => {
          var markers = [];
            var marker = new window.google.maps.Marker({
              position: { lat: 41.0082, lng: 28.9784 },
              map: map,
              title: 'Hello Istanbul!'
            });

            markers.push(marker);
            var input = document.getElementById('pac-input');
            var searchBox = new window.google.maps.places.SearchBox(input);
            map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(input);
    
            // Bias the SearchBox results towards current map's viewport.
            map.addListener('bounds_changed', ()=> {
              searchBox.setBounds(map.getBounds());
            });
            // Listen for the event fired when the user selects a prediction and retrieve
            // more details for that place.
            searchBox.addListener('places_changed', async function() {
              var places = searchBox.getPlaces();
              if (places.length == 0) {
                return;
              }
              // Clear out the old markers.
              markers.forEach(function(marker) {
                marker.setMap(null);
              });
              markers = [];
              // For each place, get the icon, name and location.
              var bounds = new window.google.maps.LatLngBounds();
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
            
              var geocoder = new window.google.maps.Geocoder();
              var country = "";
              var city = "";
              await geocoder.geocode({
                'latLng': markers[0].position
              }, function(results, status) {
                if (status == window.google.maps.GeocoderStatus.OK) {
                  if (results[0]) {
                    
                    for(const comp of results[0].address_components){
                      if (comp.types[0] === "administrative_area_level_1"){
                        city = comp.long_name;
                        
                      }
                      if (comp.types[0] === "country"){
                        country = comp.long_name;
                      }
                    }
                    var loc_state = markers[0].position;
                  
                    this.setState({location:{
                      latitude:loc_state.lat(),
                      longitude:loc_state.lng(),
                      city:city,
                      country:country
                      }});
                  }
                }
              }.bind(this))
          
              
            map.fitBounds(bounds);
            }.bind(this));
            map.addListener('click', async (e) => {
              await this.placeMarkerAndPanTo(e.latLng, map,markers[0]);
              var geocoder = new window.google.maps.Geocoder();
              var country = "";
              var city = "";
            geocoder.geocode({
                'latLng': markers[0].position
              },  function(results, status) {
                if (status == window.google.maps.GeocoderStatus.OK) {
                  if (results[0]) {
                    
                    for(const comp of results[0].address_components){
                      if (comp.types[0] === "administrative_area_level_1"){
                        city = comp.long_name;
                      }
                      if (comp.types[0] === "country"){
                        country = comp.long_name;
                      }
                    }
                    var loc_state = markers[0].position;
                  
                    this.setState({location:{
                      latitude:loc_state.lat(),
                      longitude:loc_state.lng(),
                      city:city,
                      country:country
                      }});
                  }
                }
              }.bind(this));
            });
          }}
      />
          
          <form onSubmit={this.handleSubmit}>
            <TextField required
                       id="name"
                       label="Name"
                       onChange={this.handleInputChange}
                       style={{ margin: 8 }}
                       placeholder="name"
                       
                       fullWidth
                       margin="normal"
                       InputLabelProps={{
                         shrink: true,
                       }}
                />
            <br/>
            <Select
                defaultValue={[]}
                isMulti
                name="colors"
                options={colourOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={this.handleChange}
            />
            
            <div>
              <Button variant="text"
                      color="primary"
                      type="submit"
                      disabled={loading}>
                Apply
              </Button>
              <br/>
             
            </div>
          </form>
          
          
          <br/>
        </Grid>
        
        <Footer />
      
      </Grid>
    );
  }
}
export default PlaceSettings;