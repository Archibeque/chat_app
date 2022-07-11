import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setChannelInfo } from '../../features/counter/appSlice';
import { Avatar } from "@mui/material"
import './friendcontact.css'
import axios from '../../components/axios'
import {moment} from 'moment'



function FriendContact() {
  const [contact, setContact] = useState([])
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()



  //  const handleCreate = () => {
  //   if (input !== undefined){
  //     axios.post(`/new/singlemessage/${user.id}/${receiverId}`)
  //       .then(() => {
  //         alert("channel created successfully")
  //       })
  //       .catch(err => console.log(err) )
  //       setOpen(false)
  //   }
  //   else{
  //       setOpen(false)
  //       alert("Something went wrong")
  //   }

  // }



  const getReceiverId = () => {
      axios.get(`/followers/${user.id}`)
      .then((res) =>{
          console.log(res.data)
          console.log(typeof(res.data))
          if(typeof(res.data) === String){
            setContact(Array(res.data))
          }else{
            setContact(res.data)
          }
      })
      .catch(err => console.log(err))
  }
  
    useEffect(() => {
        getReceiverId()
    },[])

    console.log(typeof(contact))
    console.log(contact)



//   const getReceiverId = () => {
//     axios.get(`/followers/${user.id}`)
//     .then((res) =>{
//         // console.log(res.data)
//         // setContact(res.data)
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



  
  return (
  <div className="container">
        { 
           contact.map(({_id, name, date}) => (

              <div className="friend" onClick={() => dispatch(setChannelInfo({
                contactId:_id,
                contactName: name,
                channelId: null,
                channelName: null
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