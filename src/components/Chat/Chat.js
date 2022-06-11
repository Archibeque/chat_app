import React, { useEffect, useState } from 'react'
import ChatHeader from './ChatHeader'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard'
// import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'
import GifIcon from '@material-ui/icons/Gif'
import EmojiSymbolsIcon from '@material-ui/icons/EmojiSymbols'

import './Chat.css'
import Message from '../main/Message'
import axios from '../axios'
import { useSelector } from 'react-redux'
// import { selectUser } from '../../features/counter/userSlice'
import { selectChannelId, selectChannelName, selectContactId, selectContactName } from '../../features/counter/appSlice'
import { IconButton } from '@material-ui/core'
// import { io } from "socket.io-client";

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import EmojiEmotions from '@material-ui/icons/EmojiEmotions'






// const pusher = new Pusher('5cfa35d1fb08dbbee50b', {
//     cluster: 'mt1'
//   });


function Chat() {

    // const user = useSelector(selectUser)
    const channelId = useSelector(selectChannelId)
    const channelName = useSelector(selectChannelName)
    const contactlId = useSelector(selectContactId)
    const contactName = useSelector(selectContactName)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    
    
    
    
    const handleEmojiPickerhideShow = () => {
      setShowEmojiPicker(!showEmojiPicker);
    };
   

    const handleEmojiClick = (event, emojiObject) => {
        let message = input;
        message += emojiObject.emoji;
        setInput(message);
      };


    const getConversation = (channelId) => {
        if (channelId) {
            axios.get(`/new/messageList?id=${channelId}`) 
                .then((res) =>{
                    setMessages(res.data[0].conversation)
                })
                .catch(err => console.log(err))
        }
    }

    useEffect( () =>{
        getConversation(channelId)


        // const channel = pusher.subscribe('conversation');
        // channel.bind('newmessage', function(data) {
        //     getConversation(channelId)
        // });

        // return (
        //     pusher.unsubscribe
        // )

    },[channelId])

    

    const sendMessage = (e) => {
        e.preventDefault()

        axios.put(`/new/message?id=${channelId}`, {
            message: input,
            timestamp: Date.now()
        })

        
        setInput('')
    }
    // let socket = io("ws://localhost:8900")
    // socket.on('connect', () => {
    //     console.log("it worked")
    // })
    

    return (
        <div className="chat">
            <ChatHeader />
            <div className="chat__messages">
            {
            messages.map(({timestamp, message, i}) => (
              <Message key={i} timestamp={timestamp} message={message} />
          ))}
            
            </div>

            <div className="chat__input">
                {/* <IconButton> */}
                    <AddCircleIcon color="primary" />
                {/* </IconButton> */}
                <form>
                    <input type='text' placeholder={`Message #${ channelName || contactName} `} value={input} onChange={(e) => setInput(e.target.value)} />
                    <button className="chat__inputButton" onClick={sendMessage} >
                        Send Message
                    </button>
                </form>

                <div className="chat__inputIcons">
                    <IconButton>
                        <CardGiftcardIcon fontsize="large" color="primary" />
                    </IconButton>
                    <IconButton>
                        <GifIcon fontsize="large" color="primary" />
                    </IconButton>
                    <IconButton>
                        <EmojiEmotions onClick={handleEmojiPickerhideShow} color="primary" />
                        {/* {showEmojiPicker && <Picker className="emojiStyle" onEmojiClick={handleEmojiClick} />} */}
                            
                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default Chat
