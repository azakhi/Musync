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
import CircularProgress from "@material-ui/core/CircularProgress";


class Place extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    
    this.state = {
      isConnected: false,
      isOwner: false,
      loading: false,
      id: props.match.params.id,
      place: null,
      open: false,
      searchResults: [],
      searchTerm: "",
      searchLoading: false
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

  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ searchResults: [] });
    this.setState({ open: false });
  };
  
  getSearchResults() {
    this.setState({
      searchLoading: true
    });
    
    const url = SERVER_DOMAIN + "/searchsong";
    axios.post(url, {songName: this.state.searchTerm} )
      .then((response) => {
        let searchResults = response.data;
        this.setState({
          searchResults: searchResults,
          searchLoading: false
        })
      })
      .catch((error) => {
        console.log(error.response.data);
        this.setState({
          searchLoading: false
        })
      });
  };
  
  render() {
    const buttonStyle = {
      display: "inline-block",
      margin: "5px"
    };
  
    const {place, isOwner, connectedPlace} = this.props;
    const isConnected = isOwner || ( place && (place._id === connectedPlace) );

    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>

        <Navbar isPlaceHeader={true}/>

        <Grid container item xs={11} md={8} justify="center">
          {
            place &&
            <PlaceCard place={place}
                       type={PlaceCardTypes.PlaceView}
                       isConnected={isConnected} />
          }
        </Grid>
        
        <Grid item xs={12} md={8} style={{textAlign: 'center'}}>
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
            <Button href={`/place/settings/${this.state.id}`}
                    variant="contained"
                    color="primary"
                    style={buttonStyle}>
              <FontAwesomeIcon icon="sliders-h"/>&nbsp;
              Settings
            </Button>
          }
        </Grid>

        <Footer/>
        
        <Dialog open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title" >
          <DialogContent>
            <DialogContentText>
              Search for a song
            </DialogContentText>
          
            <form onSubmit={this.getSearchResults}>
              <TextField
                autoFocus
                margin="dense"
                id="searchTerm"
                label=""
                type="text"
                fullWidth
                onChange={this.handleInputChange} />
              
              <SearchList songs={this.state.searchResults}
                          genres={place && place.genres}
                          onAddPlaylist={this.handleClose}/>
            
              <DialogActions>
                {this.state.searchLoading && <CircularProgress size={24}/>}
                
                <Button  onClick={this.getSearchResults} color="primary" variant="contained">
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
