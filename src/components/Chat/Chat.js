import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import GifIcon from "@material-ui/icons/Gif";
import "./Chat.css";
import Message from "../main/Message";
import axios from "../axios";
import { useSelector } from "react-redux";
import {
  selectChannelId,
  selectChannelName,
  selectContactId,
  selectContactName 
} from "../../features/counter/appSlice";
import { IconButton } from "@material-ui/core";
import { Emoji } from "./Emoji";
import { io } from "socket.io-client";



// const pusher = new Pusher('5cfa35d1fb08dbbee50b', {
//     cluster: 'mt1'
//   });

function Chat() {
  const { user } = useSelector((state) => state.auth);

  // const appstate = useSelector((state) => state.app);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageSender, setMessageSender] = useState([]);
  const scrollRef = useRef();
  const socket = useRef(io("ws://localhost:8900"))



  // const [channelId, setChannelId] = useState("");
  // const [channelName, setChannelName] = useState("");
  // const [contactId, setContactId] = useState("");
  // const [contactName, setContactName] = useState("");
  const [contactMessageId, setContactMessageId] = useState(null);
  const appStateChannelId = useSelector(selectChannelId)
  const appStateChannelName = useSelector(selectChannelName)
  const appStateContactId = useSelector(selectContactId)
  const appStateContactName = useSelector(selectContactName)

  // const channel = useSelector((state) => state.app.channelId)
  // console.log(channel)

  

  // const handleEmojiClick = (event, emojiObject) => {
  //   let message = input;
  //   message += emojiObject.emoji;
  //   setInput(message);
  // };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setInput(input + emoji);
  };

  const getChannelConversation = () => {
    if (appStateChannelId !== null) {
      axios
        .get(`/new/messageList/${appStateChannelId}`)
        .then((res) => {
          setMessages(res.data[0].message);
          console.log(res.data)
          // setMessageSender(res.data[0].user)
        })
        .catch((err) => console.log(err));
      
    } 
  }

  const getContactConversation = () => {
    setMessages([])
    axios
      .post(`/new/singlemessage/${user.id}/${appStateContactId}`)
      .then((res) => {
        setContactMessageId(res.data.id);
        console.log(res.data);

      })
      .catch((err) => console.log(err));

    if (contactMessageId !== "") {
      axios
        .get(`/singlemessage/${contactMessageId}`)
        .then((res) => {
          setMessages(res.data[0].conversation)
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  }

  const setupContactMessage = () => {
    
  };
  

  // console.log(channelId || contactId)
  useEffect(() => {
    if(appStateContactId !== null){
      setupContactMessage();
    }
  }, [appStateContactId]);

  

  useEffect(() => {
   
  }, [appS]);
  useEffect(() => {
  //   socket.on('connection', () => {
  //   console.log("it worked")
  //   console.log(socket)
  // })
    console.log(socket)
    socket.current.emit("currentUserInfo", user.id)
    socket.current.on("getUsers", users => { 
      console.log(users)
    })
    console.log("noy")


  },[user]);




  useEffect(() => {
    console.log(appStateChannelId)

    // if (appStateChannelId !== null) {
    //   setChannelId(appStateChannelId);
    // }
    // else if (appStateContactId !== null) {
    //   setContactId(appStateContactId);
    // }

    if (appStateChannelId) {
      getChannelConversation();
    } else if (appStateContactId) {
      getContactConversation();
    }
    else{
      setMessages([])
    }

    // const channel = pusher.subscribe('conversation');
    // channel.bind('newmessage', function(data) {
    //     getConversation(channelId)
    // });

    // return (
    //     pusher.unsubscribe
    // )
  }, [appStateChannelId, appStateContactId]);
  // console.log(channelId, contactId)

  const sendMessage = (e) => {
    e.preventDefault();

    if (appStateChannelId !== null) {
      axios.put(`/new/message?id=${appStateChannelId}`, {
        message: input,
        timestamp: Date.now(),
        sender: user.id
      });
    } else if (appStateContactId !== null) {
      axios
      .post(`/singlemessage/${user.id}`, {
        singlechatId: contactMessageId,
        message: input,
        timestamp: Date.now(),
        sender: user.id
      })
      .then(console.log)
    }

    setInput("");
  };
  
  console.log(appStateChannelId, appStateContactId);
  console.log(contactMessageId)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  
  return (
    <div className="chat">
      <ChatHeader />
      <div className="chat__messages">
        {messages.map(({ timestamp, message, _id, sender }) => (
          <div ref={scrollRef}>
            <Message key={_id} timestamp={timestamp} message={message} messageid={_id} messageSender={sender} />
          </div>
        ))}
      </div>

      <div className="chat__input">
        {/* <IconButton> */}
        <AddCircleIcon color="primary" />
        {/* </IconButton> */}
        <form>
          <input
            type="text"
            placeholder={`Message #${
              appStateChannelName || appStateContactName
            } `}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="chat__inputButton" onClick={sendMessage}>
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
          <Emoji addEmoji={addEmoji} />
          
        </div>
      </div>
    </div>
  );
}

export default Chat;








// problem
// wheneva i refresh for contact msg to be fetched,
// there is no id in contactmessageid which causes a problem