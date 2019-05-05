import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import PlaceMarker from "./PlaceMarker";

const Map2 = withScriptjs(withGoogleMap((props) =>{

  const markers = props.places.map( place => {
  let marker = <PlaceMarker
                  key={place._id}
                  uid={place._id}
                  place={place}
                  location={{lat: place.location.latitude, lng: place.location.longitude}}
                  activeMarker={place.uid === props.activeMarker ? true : false}
                />
  return marker
  })

  const mapOptions = {
    mapTypeControl: false,
    //styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
  };

  return (
      <GoogleMap options={mapOptions}
        defaultZoom={5}
        center={ { lat:  39, lng: 32 } }
        >
        {markers}
      </GoogleMap>
    );
  }
))

export default Map2;
