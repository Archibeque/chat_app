import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setContactInfo } from '../../features/counter/appSlice';
import { Avatar } from "@mui/material"
import './friendcontact.css'
import axios from '../../components/axios'
import {moment} from 'moment'



function FriendContact({ handleClose }) {
  const [contact, setContact] = useState([])
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()


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

  return (
  <div className="container">

          {contact.map(({_id, name, date}) => (

              <div className="friend" onClick={() => dispatch(setContactInfo({
                contactId:_id,
                contactName: name
              }))}>
                <Avatar key={_id} />
                <div className="name">{name}</div>
                <div className="last seen">{date}</div>
              </div>
          ))
            
          } 
  </div>

  )
}

export default FriendContact