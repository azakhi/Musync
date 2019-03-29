import React from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export function placeCard(props, type) {
  const {id, name, image, genres, currentSong} = props;
  const isTypePrimary = (type === PlaceCardTypes.HomeViewPrimary);
  const isTypeSecondary = (type === PlaceCardTypes.HomeViewSecondary);
  const isTypePlaceView = (type === PlaceCardTypes.PlaceView);
  
  const showMedia = (isTypePrimary || isTypePlaceView);
  const imageHeight = isTypePrimary ? "auto" : 150;
  const showCardActions = (isTypePrimary || isTypeSecondary);
  
  return (
    <Grid item xs={12} key={id}>
      <Card square elevation={isTypePrimary ? 2 : 1}>
        {
          showMedia &&
          <CardMedia component="img"
                     alt={name + " image"}
                     height={imageHeight}
                     image={image}
                     title={name + " image"}
                     style={{objectFit:"cover"}}/>
        }
        
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {name}
            <Typography inline style={{verticalAlign: "10%"}}>
              {" · " + genres.join(", ")}
            </Typography>
          </Typography>
          <Typography align="center" variant="body2">
            <FontAwesomeIcon icon="music"/>
            {" Now Playing: " + currentSong}
          </Typography>
        </CardContent>
        
        {
          showCardActions &&
          <CardActions style={{justifyContent: 'center'}}>
            <Button color="primary"
                    size="small"
                    variant={isTypePrimary ? "contained" : "text"}
                    onClick={()=>{console.log('I am here: ' + name)}}>
              I am here!
            </Button>;
          </CardActions>
        }
      </Card>
    </Grid>
  );
}

export const PlaceCardTypes = {
  HomeViewPrimary: 1,
  HomeViewSecondary: 2,
  PlaceView: 3
};