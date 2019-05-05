import Button from "@material-ui/core/Button/index";
import React from 'react';
import TextField from '@material-ui/core/TextField';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import Grid from "@material-ui/core/Grid/index";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {GET_VOTING_STATUS_URL, VOTE_URL} from "../../config";
import axios from "axios";
import Chip from "@material-ui/core/Chip/index";


class BiddingSlot extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateVoteStatus = this.updateVoteStatus.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.state = {
      songs: [],
      amount: "",
      selectedItem: 0,
    };
  }
  
  
  componentDidMount() {
    this.updateVoteStatus();
    
    const refreshIntervalId = setInterval(this.updateVoteStatus, 5000);
    this.setState({
      refreshIntervalId: refreshIntervalId
    });
  }
  
  componentWillUnmount() {
    clearInterval(this.state.refreshIntervalId);
  }
  

  handleInputChange(event) {
    this.setState({
      amount: event.target.value
    });
  }
  
  handleOnClick(val){
    this.setState({
      selectedItem: val
    });
  }

  handleSubmit(event){
    let url = VOTE_URL +"?points="+ this.state.amount+"&songIndex="+this.state.selectedItem;
    axios.get(url)
      .then((response) => {
        this.setState({
          successMessage: "You have succesfully bidded "+this.state.amount+" points",
          errorMessage: null
        });
      })
      .catch((error)=>{
        console.log(error);
        this.setState({
          successMessage: null,
          errorMessage:error.response.data
        });
      });

  }  

  updateVoteStatus() {
    axios.post(GET_VOTING_STATUS_URL, {placeId: this.props.placeId} )
      .then((response) => {
        let songs = [];
        let data = response.data;
        let votes = data.votes;
        let votedSongs = data.votedSongs;
        
        for(let i = 0; i < votes.length; i++){
          songs.push({
            votingCount:votes[i],
            img:votedSongs[i].songUri,
            title:votedSongs[i].name,
            author:votedSongs[i].artistName[0]
          });
        }
        this.setState({songs: songs});
   
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  
  render() {
    const {songs,errorMessage,successMessage} = this.state;
    const errorIcon = <FontAwesomeIcon icon={"exclamation-triangle"}/>;
    const successIcon = <FontAwesomeIcon icon={"check-circle"}/>;
    
    return (
      <Grid style = {{marginBottom:"5%"}}>
        {
          (songs && songs.length === 3) &&
        
          <Grid container spacing={24} alignItems="center" >
            
            <Grid item xs={12}>
              <GridList cols={3} cellHeight={140} >
                {createSlots(this)}
              </GridList>
            </Grid>
            
            <Grid item xs={12} >
            
                <Grid  container alignItems="center" justify="center" >
                  
                 
                    <TextField
                      id="votePoints"
                      label="Points"
                      onChange={this.handleInputChange}
                      variant="outlined" margin="dense"/>
                
              
                    <Button variant="text"
                            color="primary"
                            onClick={this.handleSubmit} >                   
                      Vote
                    </Button>
                    
             
                

                  {successMessage && <Chip style = {{marginBottom:"5%",marginTop:"2%"}} label={successMessage}
                                    icon={successIcon}
                                    color="primary"
                                    variant="outlined"/>}

                  {errorMessage && <Chip style = {{marginBottom:"5%",marginTop:"2%"}}label={errorMessage}
                                      icon={errorIcon}
                                      color="secondary"
                                      variant="outlined"/>}
                </Grid>              
            </Grid>
          </Grid>
          
        }
      </Grid>
    );
  }
}



function createSlots(self){
  
  return [0,1,2].map(val => {
    let style = {borderColor: "", borderStyle: ""};
    if(self.state.selectedItem === val)
      style = {
        borderColor: "green",
        borderStyle: "solid"
      };
    
    return (
      <GridListTile onClick={()=>self.handleOnClick(val)}
                    key={val}
                    style={style} >
        <img src={self.state.songs[val].img}
             alt={self.state.songs[val].title}/>
             
        <GridListTileBar title={self.state.songs[val].title}
                         subtitle={<span> {self.state.songs[val].author}</span>}
                         actionIcon={
                           <IconButton style={{color:"white"}} >
                             {self.state.songs[val].voteCount}
                           </IconButton> } />
      </GridListTile>
    );
  })
}

export default BiddingSlot;

