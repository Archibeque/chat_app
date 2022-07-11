import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import './sidebar.css'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import GroupIcon from '@material-ui/icons/Group';
import AddIcon from '@material-ui/icons/Add';
import axios from '../axios'
import { setChannelInfo } from '../../features/counter/appSlice';
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Fab } from '@material-ui/core';
import FriendList from './FriendList';
import InviteFriend from './InviteFriend';


// import Pusher from 'pusher-js'



// const pusher = new Pusher('5cfa35d1fb08dbbee50b', {
//   cluster: 'mt1'
// });

const useStyles = makeStyles(() =>
  createStyles({
    scapy: {
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      flex: "1",
    },
    shift: {
      position: "relative",
      top: "30%",
    },
  }),
);





export default function Sidebar() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [input, setInput] = useState("")
  
  const dispatch = useDispatch()
  
  const { user } = useSelector((state) => state.auth)

  const handleClickOpen = () => {
    setOpen(true);

    // const set = (e) => {
    //   this.setState({textValue: e.target.value});
    // }
    // if(setChannelCreate){
    //   axios.post('/new/channel')
    // }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    if (input !== undefined){
      axios.post(`/new/channel/`,{
        user: user,
        channelName: input
      })
        .then(() => {
          prompt("channel created successfully")
        })
        .catch(err => console.log(err) )
        setOpen(false)
    }
    else{
        setOpen(false)
        alert("Something went wrong")
    }

  }



  const getChannels = () => {
    axios.get(`/new/channelList/${user.id}`
    )
      .then((res) => {
        console.log(res.data)
        setChannels(res.data)
        console.log(channels)
      })
      .catch(err => console.log(err))
  }


  useEffect(() => {
    getChannels()
    

    // const channel = pusher.subscribe('channels');
    // channel.bind('newchannel', function(data) {
    //   getChannels()
    // });


    // return (
    //     pusher.unsubscribe
      
    // )

  },[])
  ////////////////////////////////////////////////
  /////////////////////////////////////////////////

  




  return (
    <div>
      <div className="sidebar__top">
        <h3 className="sidebar__touppercase">channel list</h3>
        {/* <ExpandMoreIcon /> */}
      </div>
      
      <div className="sidebar__header">
        <div className="sidebar__addchannel">
        <ExpandMoreIcon />
        <h4>AddChannel</h4>
        </div>
        <Fab size="small" color="primary" aria-label="add">
          <AddIcon onClick={handleClickOpen} />
        </Fab>
      </div>


     <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Channel</DialogTitle>
        <DialogContent>
          <DialogContentText>
             please enter the channel name you wish to create. 
          </DialogContentText>
          <TextField
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            margin="dense"
            id="channelname"
            label="Channel Name"
            type="text"
            fullWidth
          />
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

        <List className={classes.scapy} id="sidebar__scapy">
          {
          channels.map(({id, name}) => (
            <ListItem button key={id}>
              <ListItemIcon>{name % 2 === 0 ? <InboxIcon color="primary" /> : <Avatar><GroupIcon color="primary"/></Avatar>}</ListItemIcon>
              <ListItemText primary={name} className="sidebar__touppercase" onClick={() => dispatch(setChannelInfo({
                channelId: id,
                channelName: name,
                contactId: null,
                contactName: null,
              }))} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List className={classes.shift}>
          {[<FriendList />, <InviteFriend />].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <ContactMailIcon color="primary" /> : <EmojiPeopleIcon color="primary" />}</ListItemIcon>
              <ListItemText primary={text}  className="sidebar__touppercase" />
            </ListItem>
          ))}
        </List>
      
    </div>
  );
}
