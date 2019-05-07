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
      songLength: 100,
      value: 0
    };
  }
  
  componentDidMount() {
    this.incrementTimer();
    this.time = setInterval(this.incrementTimer, 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.time);
  }
  
  incrementTimer() {
    let {isPlaying, currentSong, currentSongStartTime} = this.props;
    
    if(!currentSong || currentSongStartTime === undefined || currentSongStartTime === null)
      return;
    
    currentSongStartTime = new Date(currentSongStartTime).getTime();
    this.setState(prevState => {
      let currentTime = Math.floor((Date.now() - currentSongStartTime) / 1000);
      const songLength = currentSong.duration / 1000;
      const value = (currentTime * 100) / songLength;
      currentTime = Math.floor(Math.min(currentTime, songLength));
      
      return {
        currentTime: isPlaying ? currentTime : prevState.currentTime,
        value: isPlaying ? value : prevState.value,
        songLength: Math.floor(songLength)
      }
    })
  }
  
  render() {
    return (
      <Grid container justify="center">
        <Typography align="left">
          {formatTime(this.state.currentTime)}
        </Typography>
        
        <Grid item xs={8}>
          <LinearProgress variant="determinate"
                          value={this.state.value} style={{margin: "8px"}}/>
        </Grid>
        
        <Typography align="right">
          {formatTime(this.state.songLength)}
        </Typography>
        
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