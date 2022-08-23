import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAddChannelContactInfo } from '../../features/counter/addContactSlice';
import { Avatar } from "@material-ui/core"
import './friendcontact.css'
import axios from '../../components/axios'
import Moment from 'react-moment'



// this is for adding group participants
function AddChannelContact() {
  const [contact, setContact] = useState([])
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()


  const getReceiverId = () => {
    axios.get(`/followers/${user.id}`)
    .then((res) =>{
        console.log(res.data)
        // console.log(res.data)
        setContact(res.data)
    })
    .catch(err => console.log(err))
}

  useEffect(() => {
      getReceiverId()
  },[])

  return (
  <div className="container">
        {
          contact.map(({_id, name, date}) => (
            
              <div className="friend" onClick={() => dispatch(setAddChannelContactInfo({
                cId:_id,
                cName: name
              }))}>
                <Avatar key={_id} />
                <div className="name">{name}</div>
                <div> joined: <Moment fromNow className="last seen">{date}</Moment></div>
              </div>
          ))
            
          }
  </div>

  )
}

export default AddChannelContact