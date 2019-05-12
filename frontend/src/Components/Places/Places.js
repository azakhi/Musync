import React from "react";
import Map2 from "./Map2";
import {MAP_API_KEY, SERVER_DOMAIN} from "../../config";
import axios from "axios/index"
import Grid from "@material-ui/core/Grid/index";
import Footer from "../Utils/Footer";
import Typography from "@material-ui/core/Typography/index";
import {Heading} from "../Utils/Heading";

export default class DoctorsMapContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			places: [],
	 		userLocation: { lat: 32, lng: 32 },
			loading: true
		};
	}

	componentDidMount() {
		let self = this;
		const url = SERVER_DOMAIN + '/allplaces';
		axios.get(url, {
  })
  .then(function (response) {
		self.setState({places: response.data});
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });

	navigator.geolocation.getCurrentPosition(
		position => {
			const { latitude, longitude } = position.coords;
		this.setState({
			userLocation: { lat: latitude, lng: longitude },
			loading: false
		});
	},
	() => {
		this.setState({ loading: false });
		}
	);
	}

	render() {
		const { places, loading, userLocation } = this.state;
		if (loading) {
		return null;
	}
		return (
			<Grid container
            alignItems="center"
            direction="column"
            justify="center"
            spacing={32}>
        <br/>

        <Heading />


        <Grid item xs={12} style={{textAlign: 'center'}}>

          <Typography variant="h5"
                      color="textPrimary">
            Places in Musync
          </Typography>

			<Grid item xs={12} >
			<Map2
				places={places}
				initialCenter={userLocation}
				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${MAP_API_KEY}&v=3.exp&libraries=geometry,drawing,places`}
				loadingElement={<div align="center" style={{ height: `100%` }} />}
				containerElement={<div align="center" style={{ height: `100%`, width: `100%` }} />}
				mapElement={<div align="center" style={{ height: '50vh', width:'80vw' }} />}
			/>
			</Grid>

			</Grid>

			<Footer />

		</Grid>

		);
	}
}
