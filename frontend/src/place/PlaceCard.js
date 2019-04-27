import React from "react";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const PlaceCard = (props) => {
  const {place, type} = props;
  const {name, image, genres, currentlyPlaying} = place;
  
  const isTypePrimary = (type === PlaceCardTypes.HomeViewPrimary);
  const isTypeSecondary = (type === PlaceCardTypes.HomeViewSecondary);
  const isTypePlaceView = (type === PlaceCardTypes.PlaceView);
  
  const showMedia = (isTypePrimary || isTypePlaceView);
  const imageHeight = isTypePrimary ? "auto" : 150;
  const showCardActions = (isTypePrimary || isTypeSecondary);
  
  let {handleConnectPlace} = props;
  if(typeof handleConnectPlace !== "function")
    handleConnectPlace = () => {};
  
  return (
    <Grid item xs={12} key={place._id}>
      <Card square elevation={isTypePrimary ? 2 : 1}>
        {
          (showMedia && image) &&
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
            {" Now Playing: " + currentlyPlaying}
          </Typography>
        </CardContent>
        
        {
          showCardActions &&
          <CardActions style={{justifyContent: 'center'}}>
            <Button color="primary"
                    size="small"
                    variant={isTypePrimary ? "contained" : "text"}
                    onClick={() => handleConnectPlace(place._id, name)}>
              I am here!
            </Button>;
          </CardActions>
        }
      </Card>
    </Grid>
  );
};

export const PlaceCardTypes = {
  HomeViewPrimary: 1,
  HomeViewSecondary: 2,
  PlaceView: 3
};

export default PlaceCard;
