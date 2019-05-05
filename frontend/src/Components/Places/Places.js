import React from "react";
import Map2 from "./Map2";
import {SERVER_DOMAIN} from "../../config";
import axios from "axios/index"

export default class DoctorsMapContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			places: []
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
	}

	render() {
		return (
			<Map2
				places={this.state.places}
				googleMapURL={`https://maps.googleapis.com/maps/api/js?key=KEY&v=3.exp&libraries=geometry,drawing,places`}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `600px`, width: `600px` }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
		);
	}
}
