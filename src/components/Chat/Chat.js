import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import GifIcon from "@material-ui/icons/Gif";
import "./Chat.css";
import Message from "../main/Message";
import axios from "../axios";
import { useSelector } from "react-redux";
import Robots from "../Dashboard/robots";
import {
  selectChannelId,
  selectChannelName,
  selectContactId,
  selectContactName,
} from "../../features/counter/appSlice";
import { IconButton } from "@material-ui/core";
import { Emoji } from "./Emoji";
import { io } from "socket.io-client";

// const pusher = new Pusher('5cfa35d1fb08dbbee50b', {
//     cluster: 'mt1'
//   });

function Chat() {
  const { user } = useSelector((state) => state.auth);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const socket = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [arrivalChannelMessage, setArrivalChannelMessage] = useState(null);
  const [contactMessageId, setContactMessageId] = useState(null);
  const appStateChannelId = useSelector(selectChannelId);
  const appStateChannelName = useSelector(selectChannelName);
  const appStateContactId = useSelector(selectContactId);
  const appStateContactName = useSelector(selectContactName);

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
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    if (appStateContactId !== null) {
      axios
        .post(`/new/singlemessage/${user.id}/${appStateContactId}`, {
          ReceipientName: appStateContactName,
          SenderName: user.name,
          senderPicture: user.picture,
        })
        .then((res) => {
          setContactMessageId(res.data.id);
          console.log(res.data);
        })
        .catch((err) => console.log(err));

      if (contactMessageId !== null) {
        console.log(contactMessageId);

        axios
          .get(`/singlemessage/${contactMessageId}`)
          .then((res) => {
            setMessages(res.data[0].conversation);
            console.log(res.data);
          })
          .catch((err) => console.log(err));
      }
    } else {
      setMessages([]);
    }
  }, [appStateContactId, contactMessageId, user]);

  console.log(messages);

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.on("getChannelMessage", (data) => {
      setArrivalChannelMessage({
        sender: data.sender,
        senderPicture: data.senderPicture,
        message: data.message,
        timestamp: Date.now(),
      });
      console.log(data);
    });
    console.log(arrivalChannelMessage);

    socket.current.on("getUserMessage", (data) => {
      setArrivalMessage({
        sender: data.sender,
        senderPicture: data.senderPicture,
        message: data.message,
        timestamp: Date.now(),
      });
      console.log(data);
    });
    console.log(arrivalMessage);
  }, []);

  console.log(arrivalMessage);

  useEffect(() => {
    if (appStateChannelId) {
      arrivalChannelMessage &&
        setMessages((prev) => [...prev, arrivalChannelMessage]);
    } else if (appStateContactId) {
      arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [
    arrivalMessage,
    arrivalChannelMessage,
    appStateChannelId,
    appStateContactId,
  ]);

  useEffect(() => {
    socket.current.emit("currentUserInfo", user.id);
    socket.current.emit("currentChannelInfo", appStateChannelId);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
    socket.current.on("getChannel", (channel) => {
      console.log(channel);
    });
  }, [user, appStateChannelId]);

  useEffect(() => {
    console.log(appStateChannelId);

    if (appStateChannelId) {
      getChannelConversation();
    } else {
      setMessages([]);
    }
  }, [appStateChannelId]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (appStateChannelId !== null) {
      axios.put(`/new/message?id=${appStateChannelId}`, {
        message: input,
        timestamp: Date.now(),
        sender: user.id,
        senderPicture: String(user.photo),
      });

      socket.current.emit("sendChannelMessage", {
        sender: user.id,
        senderPicture: String(user.photo),
        message: input,
        appStateChannelId,
      });
    } else if (appStateContactId !== null) {
      axios
        .post(`/singlemessage/${user.id}`, {
          singlechatId: contactMessageId,
          message: input,
          timestamp: Date.now(),
          sender: user.id,
          senderPicture: String(user.photo),
        })
        .then(console.log)
        .catch(console.log);

      console.log(appStateContactId);

      socket.current.emit("sendMessage", {
        message: input,
        sender: user.id,
        senderPicture: String(user.photo),
        receiverId: appStateContactId,
      });
    }

    setInput("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // if(appStateChannelId && appStateContactId === null){
  //   return <Robots />
  // }

  return (
    <div className="chat">
      <ChatHeader />
      {appStateChannelId === null && appStateContactId === null ? (
        <Robots />
      ) : (
        <div className="chat__messages">
          {messages.map(
            ({ timestamp, message, _id, sender, senderPicture }) => (
              <div ref={scrollRef}>
                <Message
                  key={_id}
                  timestamp={timestamp}
                  message={message}
                  messageid={_id}
                  messageSender={sender}
                  senderPics={senderPicture}
                />
              </div>
            )
          )}
        </div>
      )}

      <div className="chat__input">
        <AddCircleIcon color="primary" />

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
