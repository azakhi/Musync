import Button from "@material-ui/core/Button/index";
import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Grid from "@material-ui/core/Grid/index";
import InputAdornment from '@material-ui/core/InputAdornment';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: "80vw",
    height: "10vh",
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});




class BiddingSlot extends React.Component {
    constructor(props) {
        super(props);
        
    
        this.state = {
         amount:'',
         arr:[{borderColor: "",borderStyle:""},{borderColor: "",borderStyle:""},{borderColor: "",borderStyle:""}]
        };
        this.handleOnclick = this.handleOnclick.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
      }


      handleInputChange(event) {
            
        this.setState({
          amount: event.target.value
        });
        console.log(this.state);
   
      }
      handleOnclick(event){
            const val = event.target.key;

            const { arr } = this.state;
            for(let i = 0; i < arr.length; i++){
                if(arr[i].borderColor=="green"){
                    arr[i].borderColor="";
                    arr[i].borderStyle="";
                }
            }
            arr[val].borderColor ="green";
            arr[val].borderStyle ="solid";
            // update state
            this.setState({
                arr,
            });
        
      }

  render() {

    let {handleConnectPlace} = this.props;
    
    return (
        <Grid>
        {this.props.songs.length===3 &&
            
        <Grid container spacing={24} container alignItems="center"  >
      
        <Grid item xs={12}>
            <GridList cols={3} cellHeight={100} >
          
          {createSlots(this)}
        </GridList>
        </Grid>
        <Grid item xs={12} >
        
        <form >
        <Grid  container alignItems="center" justify="center" >
        <Grid item  >
        <TextField
          id="outlined-adornment-amount"
          variant="outlined"
          label="Amount"
          onChange={this.handleInputChange}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
        </Grid>
        <Grid item  >
        <Button variant="text"
                      color="primary"
                      type="submit"
                      >
        <FontAwesomeIcon icon={["fab", "spotify"]} size="lg"/>
                Vote
        </Button>
        </Grid>

        </Grid>
        </form>
        </Grid>
        
      </Grid>
        }
        </Grid>
    );
  }
}



function createSlots(self){
  
   return [0,1,2].map(val => {
        let style = {borderColor: self.state.arr[val].borderColor,borderStyle: self.state.arr[val].borderStyle};
        return <GridListTile onClick={self.handleOnclick} key={val} style={style}>
          <img src={self.props.songs[val].img} alt={self.props.songs[val].title} />
          <GridListTileBar 
            title={self.props.songs[val].title}
            subtitle={<span> {self.props.songs[val].author}</span>}
            actionIcon={
              <IconButton style={{color:"white"}} >
                {self.props.songs[val].voteCount}
              </IconButton>
            }
          />
        </GridListTile>;
   })
}

export default withStyles(styles)(BiddingSlot);

