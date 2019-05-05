import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Navbar from "../Utils/Navbar";
import Footer from "../Utils/Footer";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import GenrePicker from "./GenrePicker";
import withAuth from "../../auth/withAuth";
import PlaylistPicker from "./PlaylistPicker";


class CreatePlace extends Component {
  
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePlaylistChange = this.handlePlaylistChange.bind(this);
    
    this.state = {
      name: "",
      pin: "",
      location: {},
      locationFailed: false,
      locationSuccess: false,
      genres: [],
      playlist: "",
      isPermanent: true,
    };
  }
  
  handleInputChange(event) {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  
  handleCheckboxChange() {
    this.setState((prevState) => {
      return {
        isPermanent: !prevState.isPermanent
      }
    });
  }
  
  handleGenreChange(event) {
    const genres = event.map(option => option.value);
    this.setState({
      genres: genres
    });
  }
  
  handlePlaylistChange(event) {
    this.setState({
      playlist: event.value
    });
  }
  
  handleSubmit(event) {
    event.preventDefault();
    
    this.getLocation(position => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      const payload = {...this.state};
      payload.location = location;
      this.props.createPlace(payload);
    }, error => {
      console.log(error);
    });
  }
  
  getLocation(success, error) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
  
  render() {
    return (
      <Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>
        <Navbar/>
        
        <Grid item xs={11} style={{textAlign: 'center'}}>
          <Typography variant="h5"
                      color="textPrimary">
            Create a place
          </Typography>
  
          <form>
            <TextField required
                       id="name"
                       label="Name"
                       value={this.state.name}
                       onChange={this.handleInputChange}
                       margin="dense"/>
            <br/>
            <TextField required
                       id="pin"
                       label="Pincode"
                       type="number"
                       value={this.state.pin}
                       onChange={this.handleInputChange}
                       margin="dense"/>
            <br/>
            <FormControlLabel
              control={
                <Checkbox id="isPermanent"
                          checked={this.state.isPermanent}
                          onChange={this.handleCheckboxChange}
                          color="primary" />
              }
              label="For Commercial Use"
            />
            
            {
              this.state.isPermanent &&
              <GenrePicker onChange={this.handleGenreChange}/>
            }
            
            <PlaylistPicker onChange={this.handlePlaylistChange}/>
            
            <br/>
            <Button variant="contained"
                    color="primary"
                    type="submit"
                    onClick={this.handleSubmit}
                    disabled={false}>
              Create!
            </Button>
          </form>
        </Grid>
        
        <Footer style={{position: "fixed", bottom: "5%"}}/>
      </Grid>
    );
  }
}

export default withAuth(CreatePlace, 'createPlace');