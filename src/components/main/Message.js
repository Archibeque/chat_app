import { Avatar } from '@material-ui/core'
import { useSelector } from 'react-redux'
import React, {useState, useEffect } from 'react'
import './Message.css'
import axios from '../../components/axios'
// import moment from 'moment'
import Moment from 'react-moment'



function Message({timestamp, message, messageSender, senderPics }) {
    const { user } = useSelector((state) => state.auth)
    const [username, setUsername] = useState("")
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;


    const finduser = () =>
    axios.get(`/findUsers/${messageSender}`)
    .then((res) => {
    setUsername(res.data.name)
    })
    
    

    useEffect(() => {
      finduser()
    }, [messageSender])


    


    return (
        <div className={messageSender === user.id ? "message" : "other"}>
            <Avatar 
            src={  PF + senderPics } alt=""
               />
            <div className={messageSender === user.id ? "message__info" : "message__other"}>
                <h4>
                    {username}
                    <span className="message__timestamp">
                        { new Date(parseInt(timestamp)).toDateString() }
                    </span>
                </h4>
                <div className='me'>
                    <p className="message__width">{ message } </p>
                    <Moment fromNow className='timeago'>{ new Date(parseInt(timestamp)).toISOString() }</Moment>
                </div>
            </div>
        </div>
    )
}

export default Message
