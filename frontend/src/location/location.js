import axios from "axios";

import {GET_NEAR_PLACES_URL} from "../config";


class Location {
  
  constructor() {
    this.supportsLocation = (!!navigator.geolocation);
    this.permissionGiven = false;
    this.currLocation = null;
    
    this.askForPermission()
  }
  
  askForPermission() {
    navigator.permissions.query({'name': 'geolocation'}).then(status => {
      this.permissionGiven = (status.state === "granted");
      
      status.onchange = (status) => {
        this.permissionGiven = (status.state === "granted");
      }
    });
  }
  
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error)
      );
    });
  }
  
  getNearPlaces() {
    return new Promise((resolve, reject) => {
      this.getCurrentLocation()
        .then(position => {
          const data = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          
          return axios.post(GET_NEAR_PLACES_URL, data);
        })
        .then(response => {
          let result = {
            mainPlace: null,
            otherPlaces: null
          };
  
          const closestPlaces = response && response.data;
          if(Array.isArray(closestPlaces) && closestPlaces.length > 0){
            result.mainPlace = closestPlaces[0];
            result.otherPlaces = closestPlaces.splice(1);
          }
          
          resolve(result);
        })
        .catch(error => {
          console.log(error);
          reject(error)
        });
    });
  }
}

export default new Location();