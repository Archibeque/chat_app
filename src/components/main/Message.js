import { Avatar } from '@material-ui/core'
import { useSelector } from 'react-redux'
import React from 'react'
import './Message.css'

function Message({timestamp, message }) {
    const { user } = useSelector((state) => state.auth)

    return (
        <div className="message">
            <Avatar src="" />
            <div className="message__input">
                <h4>
                    {user.name}
                    <span className="message__timestamp">
                        {new Date(parseInt(timestamp)).toDateString()} 
                    </span>
                </h4>
                <p>{ message } </p>
            </div>
        </div>
    )
}

export default Message
