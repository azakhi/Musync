import React, {Component} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import Button from "@material-ui/core/Button/index";
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogContent from '@material-ui/core/DialogContent/index';
import DialogContentText from '@material-ui/core/DialogContentText/index';
import Grid from "@material-ui/core/Grid/index";
import TextField from '@material-ui/core/TextField/index';
import Typography from "@material-ui/core/Typography/index";
import auth from "../../auth/auth";
import Footer from "../Utils/Footer";
import Header from "../Utils/Header";
import PlaceCard, {PlaceCardTypes} from "./PlaceCard";
import Playlist from "./Playlist";
import SearchList from "./SearchList";
import {SERVER_DOMAIN} from "../../config";
import axios from "axios/index"

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
    this.requestPlaceInfo();
    this.checkConnectionStatus();
  }

  componentWillUnmount() {
    auth.cancelRequestPlaceInfo();
    auth.cancelConnectPlaceInfo();
  }
  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
    console.log(this.state);
  }

  requestPlaceInfo() {
    this.setState({
      loading: true
    });

    const id = this.state.id;
    auth.requestPlaceInfo(id)
      .then(response => {
        const place = response.data;
        place["genres"] = [];

        this.setState({
          place: place,
          isOwner: place.hasOwnProperty("owner"),
          loading: false
        });
      })
      .catch(() => {
        this.props.history.push("/");
      })
  }

  checkConnectionStatus() {
    this.setState({
      loading: true
    });

    const id = this.state.id;
    auth.connectToPlace(id)
      .then(() => {
        this.setState({
          isConnected: true,
          loading: false
        });
      })
      .catch(() => {
        this.setState({
          isConnected: false,
          loading: false
        });
      })
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
          console.log(response.data);
          for(var i = 0; i < response.data.tracks.items.length; i++){
            artistName = "";
            for(var j = 0; j < response.data.tracks.items[i].artists.length; j++){
              artistName += response.data.tracks.items[i].artists[j].name + ", ";
            }
            artistName = artistName.substring(0, artistName.length - 2);
            console.log(response.data.tracks.items[i].name);
            results.push({id: response.data.tracks.items[i].id, name:response.data.tracks.items[i].name, artist: artistName, length: response.data.tracks.items[i].duration_ms / 1000 });
            songIds.push(response.data.tracks.items[i].id);
          }
          console.log("Results are:", results);
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
    const currentPlace = this.state.place;
    const songs = [
      {name: "To Live Is To Die", artist: "Metallica", length: 9.48},
      {name: "Highway to Hell", artist: "AC/DC", length: 3.28},
      {name: "Holy Diver", artist: "Dio", length: 5.40},
      {name: "The Trooper", artist: "Iron Maiden", length: 4.12},
      {name: "One", artist: "Metallica", length: 7.27},
      {name: "Ace of Spades", artist: "Motörhead", length: 2.45}
    ];

    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>

        <br/>

        <Header isPlaceHeader={true}/>

        <Grid container item xs={11}>
          {currentPlace && <PlaceCard place={currentPlace} type={PlaceCardTypes.PlaceView}/>}
        </Grid>

        <Grid item xs={12} style={{textAlign: 'center'}}>
          <Typography align="center" variant="h5" gutterBottom>
            Play Queue
          </Typography>

          <Playlist songs={songs}/>

          <br/>

          <Button variant="contained"
                  color="primary"
                  onClick={this.handleClickOpen}
                  style={buttonStyle}>
            Add Song!
          </Button>
          <br/>
          <Button href="/placeSettings"
                  variant="contained"
                  color="primary"
                  style={buttonStyle}>
            <FontAwesomeIcon icon="sliders-h"/>&nbsp;
            Settings
          </Button>
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
              <SearchList songs={this.state.searchResults} ids={this.state.resultIds} playlistId = {"123456"}/>
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

export default Place;
