import React from "react";

import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import PlaceCard, {PlaceCardTypes} from "../Place/PlaceCard";


export const NearPlaces = (props) => {
  const {mainPlace, otherPlaces, handleConnectPlace} = props;
  let mainPlaceCard = <Typography gutterBottom align="center">
    Sorry, we could not find any place near you :(
  </Typography>;
  
  if(mainPlace)
    mainPlaceCard = <PlaceCard place={mainPlace}
                               type={PlaceCardTypes.HomeViewPrimary}
                               handleConnectPlace={handleConnectPlace}/>;
  
  return (
    <Grid container item xs={11} md={8} justify="center">
      {mainPlaceCard}
      
      {
        mainPlace &&
        <Grid container item xs={10} spacing={16} justify="center">
          <br/>
          <Typography gutterBottom align="center" style={{marginTop: "10%"}}>
            Are you not in {mainPlace.name}? Try these ones
          </Typography>
          
          {renderOtherPlaces(otherPlaces, 5, handleConnectPlace)}
        </Grid>
      }
    </Grid>
  );
};

function renderOtherPlaces(otherPlaces, limit, cb) {
  if(!otherPlaces)
    return;
  
  let result = [];
  for (let i = 0; i < otherPlaces.length; i++) {
    if(limit < i)
      break;
    
    result.push(
      <PlaceCard place={otherPlaces[i]}
                 type={PlaceCardTypes.HomeViewSecondary}
                 key={i.toString()}
                 handleConnectPlace={cb}/>
    );
  }
  return result;
}