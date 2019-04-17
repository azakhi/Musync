import React, {Component} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";


class Footer extends Component{
  constructor(props) {
    super(props);
  }
  
  render() {
    const {style} = this.props;
    
    const brands = [
      {name: "facebook", url: "#facebook"},
      {name: "twitter", url: "#twitter"},
      {name: "instagram", url: "#instagram"},
      {name: "linkedin", url: "#linkedin"}];
    
    let id = 0;
    const brandLinks = brands.map(brand => {
      id++;
      return renderBrandLink(brand.name, brand.url, id);
    });
  
    return (
      <Grid item xs={12} style={style}>
        {brandLinks}
      </Grid>
    );
  }
}

function renderBrandLink(brand, url, id) {
  return (
    <Link href={url} style={{margin: "10px"}} key={id}>
      <FontAwesomeIcon icon={["fab", brand]} size="lg"/>
    </Link>
  );
}

export default Footer;