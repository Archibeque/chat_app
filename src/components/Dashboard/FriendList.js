import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Radio, Select, TextField } from '@material-ui/core'
import axios from '../../components/axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FriendContact from './FriendContact'

// import { useDemoData } from '@mui/x-data-grid-generator';

function FriendList() {
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("")
  const [receiverId, setReceiverId] = useState({})
  const [contact, setContact] = useState([])



  const handleClickOpen = () => {
    setOpen(true);

  }

  const handleClose = () => {
    setOpen(false);
  };




  const handleCreate = () => {
    if (input !== undefined){
      axios.post(`/new/singlemessage/${user.id}/${receiverId}`)
        .then(() => {
          alert("channel created successfully")
        })
        .catch(err => console.log(err) )
        setOpen(false)
    }
    else{
        setOpen(false)
        alert("Something went wrong")
    }

  }

  const getReceiverId = () => {
    axios.get(`/followers/${user.id}`)
    .then((res) =>{
        console.log(res.data)
        // console.log(res.data.name,res.data._id)
        setContact(res.data)
    })
    .catch(err => console.log(err))
}

  useEffect(() => {
      getReceiverId()
  },[])



  const sendMessage = () => {
    // e.preventDefault()
    
    axios.post(`/new/singlemessage/${user.id}/${receiverId}`, {
    message: "ready",
    timestamp: Date.now()
  })}

  

  return (

    <>
    <div onClick={handleClickOpen}>Friend</div>


    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Select Friend</DialogTitle>
        <DialogContent>
          <DialogContentText>
             please select A friend to message
          </DialogContentText>
          {/* <select >
            <option> 
          { receiverId }
            </option>
            <option> 
          { receiverId }
            </option>
          </select> */}
          <FriendContact onClose={handleClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default FriendList