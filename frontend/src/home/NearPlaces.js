import React from "react";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PlaceCard, {PlaceCardTypes} from "../place/PlaceCard";


export const NearPlaces = (props) => {
  const {mainPlace, otherPlaces} = props;
  let mainPlaceCard = <Typography gutterBottom align="center">
    Sorry, we could not find any place near you :(
  </Typography>;
  
  if(mainPlace)
    mainPlaceCard = <PlaceCard place={mainPlace} type={PlaceCardTypes.HomeViewPrimary}/>;
  
  return (
    <Grid container item xs={11} justify="center">
      {mainPlaceCard}
      
      {
        mainPlace &&
        <Grid container item xs={10} spacing={16}>
          <br/>
          <Typography gutterBottom align="center">
            {`Are you not in ${mainPlace.name}? Try these ones.`}
          </Typography>
          
          {renderOtherPlaces(otherPlaces, 5)}
        </Grid>
      }
    </Grid>
  );
};

function renderOtherPlaces(otherPlaces, limit) {
  if(!otherPlaces)
    return;
  
  let result = [];
  for (let i = 0; i < otherPlaces.length; i++) {
    if(limit < i)
      break;
    
    result.push(
      <PlaceCard place={otherPlaces[i]}
                 type={PlaceCardTypes.HomeViewSecondary}
                 key={i.toString()}/>
    );
  }
  return result;
}