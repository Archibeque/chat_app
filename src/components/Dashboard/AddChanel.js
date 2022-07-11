import React,{ useState, useEffect } from 'react'
import { Tooltip } from '@material-ui/core'
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import AddChannelContact from './AddChannelContact'
import axios from '../../components/axios'
import { selectcId } from '../../features/counter/addContactSlice'
import { useSelector } from 'react-redux'
import { selectChannelId } from '../../features/counter/appSlice'
import { toast } from 'react-toastify'



function AddChanel() {
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false);
    const { user } = useSelector((state) => state.auth)
    const [realchannelId, setRealChannelId] = useState("")
    const cId = useSelector(selectcId);
    const channelId = useSelector(selectChannelId)




    const addContactToChannnel = () => {

        console.log(selectChannelId)
        console.log(selectcId)
    
        axios.post(`/addGroupContact/${channelId}/${user.id}/${cId}`)
        .then((res) =>{
            console.log(res.data)
            toast.success(`Contact Succesfully Added`)
        })
        .catch(err => console.log(err))
    }

    const handleClickShow = () => {
        setShow(true);
    }
    const handleClickClose = () => {
        setShow(false)
    }

    const handleClickOpen = () => {
    setOpen(true);
    }

    const handleClose = () => {
    setOpen(false);
    };

    // useEffect(() => {
    
    //     if (realchannelId !== null) {
    //         console.log(realchannelId)
    //       setChannelId(realchannelId);
    //     }
    // }, [realchannelId]);

    useEffect(() => {
        addContactToChannnel()
    },[cId])
    

  return (
    <>
        <Tooltip title="Add Participants!">
            <PeopleAltRoundedIcon color="primary" onClick={
                channelId ? handleClickOpen : handleClickShow
            } />
        </Tooltip>

        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Participants</DialogTitle>
        <DialogContent>
        <DialogContentText>
            please select A Participant To Add 
        </DialogContentText>
        
        <AddChannelContact />
        
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} color="secondary">
            Cancel
        </Button>
        <Button color="primary">
            Save
        </Button>
        </DialogActions>
    </Dialog>


    <Dialog open={show} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Participants</DialogTitle>
        <DialogContent>
        <DialogContentText>
            Please Select A Channel Before You Can Add Participants
        </DialogContentText>
        
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClickClose} color="secondary">
            Cancel
        </Button>
        </DialogActions>
        
    </Dialog>
  </>
  )
}

export default AddChanel