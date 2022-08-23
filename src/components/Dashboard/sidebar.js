import React, { useState, useEffect, useRef } from 'react';
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
import ContactMailIcon from '@material-ui/icons/ContactMail';
import AddIcon from '@material-ui/icons/Add';
import axios from '../axios'
import { useSelector } from 'react-redux'
import { Fab } from '@material-ui/core';
import FriendList from './FriendList';
import InviteFriend from './InviteFriend';
import SidebarChatToggler from './SidebarChatToggler';
import { io } from "socket.io-client";
import {
  selectChannelId,
  selectContactId,
} from "../../features/counter/appSlice";

// import Pusher from 'pusher-js'



// const pusher = new Pusher('5cfa35d1fb08dbbee50b', {
//   cluster: 'mt1'
// });

const Styles = makeStyles(() =>
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
    unshift: {
      marginTop: "20px",
      marginBottom: "30px",
      textAlign: "center",
      borderBottom: "2px solid #26282c",
      
    },
  }),
);





export default function Sidebar() {
  const classes = Styles();
  const socket = useRef()
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [friends, setFriends] = useState([]);
  const [createdChannel, setCreatedChannel] = useState([]);
  const [createdFriend, setCreatedFriend] = useState([]);
  const appStateChannelId = useSelector(selectChannelId)
  const appStateContactId = useSelector(selectContactId)

  

  const [input, setInput] = useState("")
  
  
  const { user } = useSelector((state) => state.auth)

  const handleClickOpen = () => {
    setOpen(true);

    
  };

  const handleClose = () => {
    setOpen(false);
  };

  


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

  

  const getFriends = () => {
    axios.get(`/new/singleMessageList/${user.id}`
    )
      .then((res) => {
        console.log(res.data)
        setFriends(res.data)
        console.log(friends)
      })
      .catch(err => console.log(err))
  }

  


  useEffect(() => {     
    getChannels()
    getFriends()

  },[])


    useEffect(() => {
      socket.current = io("http://localhost:5000")
      socket.current.on("getCreatedChannel", (data) => {
        setCreatedChannel({
          admin: data.creator,
          name: data.channelName
        });
        console.log(data)
      })
      console.log(createdChannel)

      socket.current.on("getCreatedFriend", (data) => {
        setCreatedFriend({
          bin: data.sender,
          name: data.contactId,
          receiverName: data.contactName,
          receiverPicture: data.contactPhoto,
          senderPicture: data.senderPicture,
          senderName: data.senderName
        });
        console.log(data)
      })
    }, [])

    // useEffect(() => {
    //   socket.current.emit("currentUserInfo", user.id)
    //   // socket.current.emit("currentChannelInfo", appStateChannelId)
    //   socket.current.on("getUsers", users => { 
    //     console.log(users)
    //   })
    //   // socket.current.on("getChannel", channel => { 
    //   //   console.log(channel)
    //   // })
      
  
  
    // },[user, appStateChannelId]);

  console.log(createdChannel)

  



  useEffect(() => {
    if(createdChannel){
      createdChannel &&
      setChannels((prev) => [...prev, createdChannel]);
    }
    else if(createdFriend){
      createdFriend &&
      setFriends((prev) => [...prev, createdFriend]);
      
    }

  },[createdChannel, createdFriend])

  console.log(createdChannel)

  console.log(channels, friends)


  ////////////////////////////////////////////////
  /////////////////////////////////////////////////

  const handleCreate = () => {
    if (input !== undefined){
      axios.post(`/new/channel/`,{
        user: user,
        channelName: input
      })
        .then((res) => {
          setChannels(res.data)
        })
        .catch(err => console.log(err) )
        setOpen(false)

        socket.current.emit("createChannel", {
          creator: user.id,
          channelName: input
        })
    }
    else{
        setOpen(false)
        alert("Something went wrong")
    }

  }

  


  return (
    <div>
      <div className="sidebar__top">
        <h3 className="sidebar__touppercase">chat list</h3>
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

        <SidebarChatToggler Styles={Styles}  channels={channels} Friends={friends} />
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
