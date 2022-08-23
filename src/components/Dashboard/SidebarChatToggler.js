import React, { useState } from 'react'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { useDispatch } from 'react-redux'
import { setChannelInfo } from '../../features/counter/appSlice';
import './sidebar.css'
import { useSelector } from "react-redux";





function SidebarChatToggler({Styles, channels, Friends}) {
    const classes = Styles();
    const dispatch = useDispatch()
    const [selectChat, setSelectChat] = useState(false)
    const { user } = useSelector((state) => state.auth);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    
    console.log(channels, Friends)



  return (
    <List className={classes.scapy} id="sidebar__scapy">
        <ListItemText className={classes.unshift}>
          <button className="sidebarToggleButton" onClick={() => { setSelectChat(!selectChat)}}>Toggle channel or friend</button>
        </ListItemText>
          {
            selectChat ?

          Friends.map(({id, receiverName, receiverPicture, senderPicture, senderName, name, bin}) => (
            <ListItem button key={id}>
              <ListItemIcon key={1}><Avatar 
              src={ user.id === bin
              ? PF + "" + receiverPicture
              : PF + "" + senderPicture
              } alt="" 
              color="primary" /></ListItemIcon>
              <ListItemText key={2} primary={user.name === senderName? receiverName : senderName} className="sidebar__touppercase" onClick={() => dispatch(
                setChannelInfo({
                channelId: null,
                channelName: null,
                channelAdmin: null,
                contactId: user.id === bin ? name[0] : bin,
                contactName: user.name === senderName? receiverName : senderName,
                // contactPhoto: user.photo
              })
              )} />
            </ListItem>
          )) :
          
          channels.map(({id, name, admin}) => (
            <ListItem button key={id}>
              <ListItemIcon key={3}>{name % 2 === 0 ? <InboxIcon color="primary" /> : <Avatar><GroupIcon color="primary"/></Avatar>}</ListItemIcon>
              <ListItemText key={4} primary={name} className="sidebar__touppercase" onClick={() => dispatch(
                setChannelInfo({
                channelId: id,
                channelName: name,
                channelAdmin: admin,
                contactId: null,
                contactName: null,
              })
              )} />
            </ListItem>
          )) 
          
        }

          <Divider />
            
        </List>
  )
}

export default SidebarChatToggler