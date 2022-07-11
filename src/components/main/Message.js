import { Avatar } from '@material-ui/core'
import { useSelector } from 'react-redux'
import React, {useState, useEffect } from 'react'
import './Message.css'
import axios from '../../components/axios'


function Message({timestamp, message, messageSender }) {
    const { user } = useSelector((state) => state.auth)
    const [username, setUsername] = useState("")

    const finduser = () =>
    axios.get(`/findUsers/${messageSender}`)
    .then((res) => 
    setUsername(res.data.name))
    

    useEffect(() => {
      finduser()
    }, [messageSender])
    
    console.log(username)
    console.log(messageSender)


    return (
        <div className={messageSender === user.id ? "message" : "other"}>
            <Avatar src="" />
            <div className={messageSender === user.id ? "message__info" : "message__other"}>
                <h4>
                    {username}
                    <span className="message__timestamp">
                        {new Date(parseInt(timestamp)).toDateString()} 
                    </span>
                </h4>
                <div className='me'>
                    <p className="message__width">{ message } </p>
                </div>
            </div>
        </div>
    )
}

export default Message
