import React, {Component} from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";


class SongPlayer extends Component {
  constructor(props) {
    super(props);
    this.incrementTimer = this.incrementTimer.bind(this);
    
    this.state = {
      currentTime: 0,
      songLength: props.songLength,
      value: 0
    };
  }
  
  componentDidMount() {
    this.time = setInterval(this.incrementTimer, 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.time);
  }
  
  incrementTimer() {
    this.setState(prevState => {
      let {currentTime, songLength} = prevState;
      currentTime++;
      const value = (currentTime * 100) / songLength;
      if(value >= 100)
        clearInterval(this.time);
      
      return {
        currentTime: currentTime,
        value: value
      }
    })
  }
  
  render() {
    return (
      <Grid container>
        <Grid item xs={2}>
          <Typography align="center">
            {formatTime(this.state.currentTime)}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <LinearProgress variant="determinate"
                          value={this.state.value}
                          style={{marginTop:"3%"}} />
        </Grid>
        <Grid item xs={2}>
          <Typography align="center">
            {formatTime(this.state.songLength)}
          </Typography>
        </Grid>
        
        
        
      </Grid>
    );
  }
}

export default SongPlayer;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = (seconds % 60).toString();
  
  return minutes + ":" + seconds.padStart(2, '0');
}