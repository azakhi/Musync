import React, {Component} from "react";
import axios from "axios"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Button from "@material-ui/core/Button/index";
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogContent from '@material-ui/core/DialogContent/index';
import DialogContentText from '@material-ui/core/DialogContentText/index';
import Grid from "@material-ui/core/Grid/index";
import TextField from '@material-ui/core/TextField/index';
import Typography from "@material-ui/core/Typography/index";

import Footer from "../Utils/Footer";
import Navbar from "../Utils/Navbar";
import PlaceCard, {PlaceCardTypes} from "./PlaceCard";
import BiddingSlot from "./BiddingSlot";
import Playlist from "./Playlist";
import SearchList from "./SearchList";
import {SERVER_DOMAIN} from "../../config";
import withAuth from "../../auth/withAuth";


class Place extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.state = {
      isConnected: false,
      isOwner: false,
      loading: false,
      id: props.match.params.id,
      place: null,
      open: false,
      searchResults: [],
      songName: "",
      resultIds: []
    };
  }

  componentDidMount() {
    const { requestPlaceInfo, match } = this.props;
    const placeId = match.params.id;
    setInterval(this.updateVoteStatus, 5000);
    setInterval(this.getPlaylist, 5000);
    requestPlaceInfo(placeId);
  }
  
  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ searchResults: [] });
    this.setState({ open: false });
  };
  
  getSearchResults = () => {
    const url = SERVER_DOMAIN + "/searchsong";
    let results = [];
    let songIds = [];
    let self = this;
    let artistName = "";
    axios.post(url, {songName: this.state.songName} )
      .then(function (response) {
        if( response.status === 200 ){
          let artistResults = [];
          let songResults = [];
          
          for(var i = 0; i < response.data.tracks.items.length; i++){
            artistName = "";
            for(var j = 0; j < response.data.tracks.items[i].artists.length; j++){
              artistName += response.data.tracks.items[i].artists[j].name + ", ";
            }
            artistName = artistName.substring(0, artistName.length - 2);
        
            results.push({id: response.data.tracks.items[i].id, name:response.data.tracks.items[i].name, artist: artistName, length: response.data.tracks.items[i].duration_ms / 1000 });
            songIds.push(response.data.tracks.items[i].id);
          }
       
          self.setState({searchResults: results});
          self.setState({resultIds: songIds});
        }
        else{
          console.log("Response not 200");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    //this.setState({ searchResults: [
    //  {name: "Ashes to Ashes", artist: "David Bowie", length: 3.48},
    //  {name: "Deutschland", artist: "Rammstein", length: 6.04},
    //  {name: "Under Pressure", artist: "Queen", length: 3.22},
    //] });
  };

  render() {
    const buttonStyle = {
      display: "inline-block",
      margin: "5px"
    };
  
    const {place, isOwner, connectedPlace} = this.props;
    const isConnected = isOwner || place && place._id === connectedPlace;

    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>

        <br/>

        <Navbar isPlaceHeader={true}/>

        <Grid container item xs={11}>
          {
            place &&
            <PlaceCard place={place}
                       type={PlaceCardTypes.PlaceView}
                       isConnected={isConnected} />
          }
        </Grid>
        
        <Grid item xs={12} style={{textAlign: 'center'}}>
          <BiddingSlot placeId={this.state.id}/>
          
          <Typography align="center" variant="h5" gutterBottom>
            Play Queue
          </Typography>

          <Playlist placeId={this.state.id}/>

          <br/>

          {
            isConnected &&
            <Button variant="contained"
                    color="primary"
                    onClick={this.handleClickOpen}
                    style={buttonStyle}>
              Add Song!
            </Button>
          }
          <br/>
  
          {
            isOwner &&
            <Button href="/place/settings"
                    variant="contained"
                    color="primary"
                    style={buttonStyle}>
              <FontAwesomeIcon icon="sliders-h"/>&nbsp;
              Settings
            </Button>
          }
        </Grid>

        <Footer/>
        
        <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogContent>
              <DialogContentText>
                Search for a song
              </DialogContentText>
            <form onSubmit={this.getSearchResults}>
              <TextField
                autoFocus
                margin="dense"
                id="songName"
                label=""
                type="text"
                fullWidth
                onChange={this.handleInputChange}
              />
              <SearchList songs={this.state.searchResults} ids={this.state.resultIds}/>
            <DialogActions>

              <Button  onClick={this.getSearchResults}  color="primary">
                Search
              </Button>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
            </form>
            </DialogContent>

          </Dialog>
      </Grid>
    );
  }
}

export default withAuth(Place, 'place');
