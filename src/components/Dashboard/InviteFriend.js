import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import "./inviteFriend.css"
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function InviteFriend() {
  const [open, setOpen] = React.useState(false);
  const [friendName, setFriendName] = React.useState("")
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <p onClick={handleClickOpen}>
        InviteFriend
      </p>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Contacts By Name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add Contacts by Name to your Contact List
          </DialogContentText>
          <TextField
            value={friendName}
            onChange={(e) => setFriendName(e.target.friendName)}
            autoFocus
            margin="dense"
            id="friendname"
            label="Friend Name"
            type="text"
            fullWidth
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        
        </DialogActions>
      </Dialog>


      {/* <Dialog
        // fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative'}} style={{background: "#5b5f5b44", marginBottom: "50px"}}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            

          </Toolbar>
        </AppBar>
        <div className="content">
           <div className="leftContent" style={{backgroundColor:"#5b5f5b44", boxShadow: "0 5px 10px #9a86f3",textAlign:"center", height:"100%", flex:"0.5", justifyContent:"center", alignItems:"center"}}>
            <p style={{fontSize: "500", fontWeight:'bolder', color:"GrayText"}}>Add Contacts By Name</p>
            <p style={{ marginBottom:"20px", padding:"10px"}}>
              Lookup Contacts by name and add to your Contact List
            </p>
            <input type='text' className='textInput' placeholder='search people' ></input>

           </div>
        </div>
        
      </Dialog>
    </div> */}
    </div>
  );
}


