
// This file contains the logic for Chat content. It basically allows the 
// content to wrap with the navbar and drawer.
//  Coded by Nnadi Daniel. All rights reserved

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
import Chat from "../Chat/Chat";


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
 
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: '#141414',
    marginLeft: -drawerWidth,
    },
   
}));

// This is the component that controls what to show


// This is the content component
function Content() {
  const classes = useStyles();


  return (
    <React.Fragment>
      <main  className={classes.content
        }>
        <div className={classes.toolbar} />
        <Chat />
      </main>
    </React.Fragment>
  );
}



export default Content
