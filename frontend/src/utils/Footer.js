import React, {Component} from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome/index'
import Grid from "@material-ui/core/Grid/index";
import Link from "@material-ui/core/Link/index";


class Footer extends Component{
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
      <Grid container
            item
            xs={12}
            justify="center"
            style={style}>
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