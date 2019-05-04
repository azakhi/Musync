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


let image = "data:image/png;base64,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";

class Place extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateVoteStatus = this.updateVoteStatus.bind(this)

    this.state = {
      voting:[
        {
          voteCount:1,
           img: image,
           title: 'Image',
           author: 'author',
         },
         {
           voteCount:1,
             img: image,
             title: 'Image',
             author: 'author',
         },
         {
           voteCount:1,
             img:image,
             title: 'Image',
             author: 'author',
         }
       ],
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
    const { requestPlaceInfo, match} = this.props;
    const placeId = match.params.id;
    setInterval(this.updateVoteStatus, 5000);
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
  updateVoteStatus = () => {
    const url = SERVER_DOMAIN + "/place/votestatus";
    axios.post(url, {placeId: this.props.match.params.id} )
    .then(function (response) {
      if( response.status === 200 ){
        
        console.log(response.data);
        /** 
        let voting = [];
        let data = response.data;
        let votes = data.votes;
        let votedSongs = data.votedSongs;
        for(let i = 0; i < votes.length; i++){
          voting.push({votingCount:votes[i],})

        }
        */
       
      }
      else{
        console.log("Response not 200");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
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
    const songs = [
      {name: "To Live Is To Die", artist: "Metallica", length: 9.48},
      {name: "Highway to Hell", artist: "AC/DC", length: 3.28},
      {name: "Holy Diver", artist: "Dio", length: 5.40},
      {name: "The Trooper", artist: "Iron Maiden", length: 4.12},
      {name: "One", artist: "Metallica", length: 7.27},
      {name: "Ace of Spades", artist: "Motörhead", length: 2.45}
    ];
  
    const {place, isOwner, connectedPlace} = this.props;
    const isConnected = place && place._id === connectedPlace;

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
          <BiddingSlot songs={this.state.voting}/>
          
          <Typography align="center" variant="h5" gutterBottom>
            Play Queue
          </Typography>

          <Playlist songs={songs}/>

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
            <Button href="/placeSettings"
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
