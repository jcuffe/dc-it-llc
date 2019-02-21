import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const styles = {
  appBar: {
    marginBottom: 10,
    paddingLeft: 50,
    paddingRight: 50
  },
  toolBar: {
    display: "flex",
    justifyContent: "space-evenly"
  },
  navItem: {
    color: "white",
    textDecoration: "none",
    "&:hover": {
      color: "grey"
    }
  }
};

const Navbar = ({ classes }) => (
  <AppBar position="static" className={classes.appBar}>
    <Toolbar className={classes.toolBar}>
      <Typography variant="h6">
        <Link to="/" className={classes.navItem}>
          Process Payments
        </Link>
      </Typography>
      <Typography variant="h6">
        <Link to="/processed" className={classes.navItem}>
          View Processed Payments
        </Link>
      </Typography>
      <Typography variant="h6">
        <Link to="/latest-response" className={classes.navItem}>
          Latest BillingTree Response
        </Link>
      </Typography>
      <Typography variant="h6">
        <Link to="/csv-export" className={classes.navItem}>
          Export Customer Data
        </Link>
      </Typography>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(Navbar);
