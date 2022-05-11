import React, { useEffect, useState } from 'react'
import ChatHeader from './ChatHeader'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard'
// import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'
import GifIcon from '@material-ui/icons/Gif'
import './Chat.css'
import Message from '../main/Message'
import axios from '../axios'
import { useSelector } from 'react-redux'
// import { selectUser } from '../../features/counter/userSlice'
import { selectChannelId, selectChannelName } from '../../features/counter/appSlice'
import { IconButton } from '@material-ui/core'
// import Pusher from 'pusher-js'

import 'emoji-mart/css/emoji-mart.css'
// import { Picker } from 'emoji-mart'





// const pusher = new Pusher('5cfa35d1fb08dbbee50b', {
//     cluster: 'mt1'
//   });


function Chat() {

    // const user = useSelector(selectUser)
    const channelId = useSelector(selectChannelId)
    const channelName = useSelector(selectChannelName)
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    // const [emojiMenuVisible, setEmojiMenuVisible] = useRef(false, ()=>{});



    // const handleEmoji = () =>{

    // }


    const getConversation = (channelId) => {
        if (channelId) {
            axios.get(`/new/messageList?id=${channelId}`) 
                .then((res) =>{
                    console.log(res.data)
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

    return (
        <div className="chat">
            <ChatHeader channelName={channelName} />
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
                    <input type='text' placeholder={`Message #${channelName} `} value={input} onChange={(e) => setInput(e.target.value)} />
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
                        {/* <EmojiEmotionsIcon fontsize="large" color="primary" onClick={setEmojiMenuVisible} /> */}
                        {/* <Picker set='apple' /> */}
                        {/* <Picker onSelect={this.addEmoji} /> */}
                        {/* <Picker title='Pick your emoji…' emoji='point_up' /> */}
                        {/* <Picker style={{ position: 'absolute', bottom: '20px', right: '20px' }} /> */}
                        {/* <Picker i18n={{ search: 'Recherche', categories: { search: 'Résultats de recherche', recent: 'Récents' } }} /> */}

                    </IconButton>
                </div>
            </div>
        </div>
    )
}

export default Chat
