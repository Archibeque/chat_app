import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import React, { useState } from 'react'
import FriendContact from './FriendContact'


function FriendList() {
  const [open, setOpen] = useState(false);
  

  const handleClickOpen = () => {
    setOpen(true);

  }

  const handleClose = () => {
    setOpen(false);
  };





  return (

    <>
    <div onClick={handleClickOpen}>Friend</div>


    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Select Friend</DialogTitle>
        <DialogContent>
          <DialogContentText>
             please select A friend to message
          </DialogContentText>
          
          <FriendContact onClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FriendList