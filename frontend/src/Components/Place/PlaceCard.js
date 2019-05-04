import React from "react";

import Button from "@material-ui/core/Button/index";
import Card from "@material-ui/core/Card/index";
import CardActions from "@material-ui/core/CardActions/index";
import CardMedia from "@material-ui/core/CardMedia/index";
import CardContent from "@material-ui/core/CardContent/index";
import Grid from "@material-ui/core/Grid/index";
import Typography from "@material-ui/core/Typography/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Chip from "@material-ui/core/Chip";
import SongPlayer from "./SongPlayer";


const PlaceCard = (props) => {
  const {place, type, isConnected} = props;
  const {name, image, genres, currentlyPlaying} = place;
  
  const isTypePrimary = (type === PlaceCardTypes.HomeViewPrimary);
  const isTypeSecondary = (type === PlaceCardTypes.HomeViewSecondary);
  const isTypePlaceView = (type === PlaceCardTypes.PlaceView);
  
  const showMedia = (isTypePrimary || isTypePlaceView);
  const imageHeight = isTypePrimary ? "auto" : 150;
  const showCardActions = (isTypePrimary || isTypeSecondary || !isConnected);
  
  let {handleConnectPlace} = props;
  if(typeof handleConnectPlace !== "function")
    handleConnectPlace = () => { console.log("Undefined handleConnectPlace() be careful.") };
  
  const connectMessage = <Chip label={`Connect to ${name} to start requesting songs!`}
                               color="primary"
                               variant="outlined" style={{marginLeft: "10%", marginBottom: "3%"}}/>;
  
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
          <Typography variant="h5" align="center">
            {name}
          </Typography>
          <Typography variant="caption" align="center" gutterBottom>
            {genres.join(", ")}
          </Typography>
          
          <Typography align="center" variant="body2">
            <FontAwesomeIcon icon="music"/>
            {" Now Playing: " + currentlyPlaying}
          </Typography>
  
          {isTypePlaceView && <SongPlayer songLength={500}/>}

        </CardContent>
        
        {
          showCardActions &&
          <CardActions style={{justifyContent: 'center'}}>
            <Button color="primary"
                    size="small"
                    variant={isTypePrimary ? "contained" : "text"}
                    onClick={() => handleConnectPlace(place._id, name)}>
              Connect!
            </Button>;
          </CardActions>
        }
        
        {(!isConnected && isTypePlaceView) && connectMessage}
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
