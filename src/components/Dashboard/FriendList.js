import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Radio, Select, TextField } from '@material-ui/core'
import axios from '../../components/axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FriendContact from './FriendContact'


function FriendList() {
  const [open, setOpen] = useState(false);
  // const [input, setInput] = useState("")
  // const [receiverId, setReceiverId] = useState({})
  // const [contact, setContact] = useState([])



  const handleClickOpen = () => {
    setOpen(true);

  }

  const handleClose = () => {
    setOpen(false);
  };



//   const getReceiverId = () => {
//     axios.get(`/followers/${user.id}`)
//     .then((res) =>{
//         console.log(res.data)
//         console.log(typeof(res.data))
//         if(typeof(res.data) === String){
//           setContact({0:"you do not have any contact"})
//         }else{
//           setContact(res.data)
//         }
//     })
//     .catch(err => console.log(err))
// }

//   useEffect(() => {
//       getReceiverId()
//   },[])



  // const sendMessage = () => {
  //   // e.preventDefault()
    
  //   axios.post(`/new/singlemessage/${user.id}/${receiverId}`, {
  //   message: "ready",
  //   timestamp: Date.now()
  // })}

  

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