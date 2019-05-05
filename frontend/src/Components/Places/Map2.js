import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";
import PlaceMarker from "./PlaceMarker";
import location from "../../location/location";

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
  };

  return (
      <GoogleMap
        options={mapOptions}
        defaultZoom={10}
        center={ props.initialCenter }
        >
        {markers}
      </GoogleMap>
    );
  }
))

export default Map2;
