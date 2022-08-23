import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setChannelInfo } from '../../features/counter/appSlice';
import { Avatar } from "@material-ui/core"
import './friendcontact.css'
import axios from '../../components/axios'
import { io } from "socket.io-client";
import Moment from 'react-moment'




function FriendContact() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [contact, setContact] = useState([])
  const [createdFriend, setCreatedFriend] = useState(null);
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const socket = useRef()



  const getReceiverId = () => {
      axios.get(`/followers/${user.id}`)
      .then((res) =>{
        setContact(res.data)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    socket.current = io("ws://localhost:8900")
    socket.current.on("getCreatedFriend", (data) => {
      setCreatedFriend({
        admin: data.contactId,
        name: data.contactName
      });
      console.log(data)
    });
    console.log(createdFriend)
  }, [])


  
    useEffect(() => {
        getReceiverId()
    },[])

    console.log(typeof(contact))
    console.log(contact)



// 


  
  return (
  <div className="container">
        { 
           contact.map(({_id, name, date, photo}) => (

              <div className="friend" onClick={() => dispatch(setChannelInfo({
                contactId:_id,
                contactName: name,
                channelId: null,
                channelName: null,
                channelAdmin: null
              })) &&
              socket.current.emit("createFriend", {
                sender : user.id,
                senderName: user.name,
                senderPicture: user.photo,
                contactId: _id,
                contactName: name,
                contactPhoto: photo
              })
              }>
          
                  <Avatar src={photo
                ? PF + "/" + photo
                : PF + ""
                } alt="" className='photo' key={_id? _id : null} />
                  <div className="name">{name ? name : "you do not have any contact"}</div>
                  <div> joined: <Moment fromNow className="last seen">{date}</Moment></div>
             
              </div>
          ))
            
        }
  </div>

  )
}

export default FriendContact