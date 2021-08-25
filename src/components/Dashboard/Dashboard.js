// This is a HOC for the entire dashboard.
//  Coded by Nnadi Daniel. All rights reserved


import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import DashboardHeader from "./DashboardHeader";
import Content from "./content";

// const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
 
}));



function Dashboard() {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <CssBaseline />
        <DashboardHeader />
        <Content />
      </div>
    );
  }


  export default Dashboard