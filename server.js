const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const messages = require('./channelMessages')
const sm = require("./singleMessages")
const User = require('./users')
const jwt = require("jsonwebtoken")
// const bcrypt = require("bcryptjs");
const http = require("http")
const usersRouter = require('./routes/users');
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");





dotenv.config();

// var JWT_SECRET = 'abc123'

class queueOffline {
    constructor() {
        this.count = 0;
        this.lowesCount = 0;
        this.items = {};
    }

    enqueue(element) {
        this.items[this.count] = element;
        this.count++;
    }
}



// app config
const app = express()
let server = http.createServer(app)
const port = process.env.PORT || 5000

app.use("/picture", express.static(path.join(__dirname, "public")));

// middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(morgan("common"));

app.use('/new', require('./routes/channel'))
app.use('', require('./routes/auth'))
app.use('', require('./routes/image'))
app.use('', require('./routes/InviteFriends'))
app.use('', require('./routes/Friend'))








//dbconfig
// const connection_url = "mongodb+srv://nnadidblord:badboyz912@cluster0.xr77h.mongodb.net/chatbackend?retryWrites=true&w=majority"
// const connection_url = "mongodb://localhost:27017/emmanuel"
const dba = mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true
    })
    .then( console.log("connected to mongodb") )
    .catch(err => console.log(err) )




//
    
//api routes
 app.get('/', async(req,res) => {
    res.send("hello Express ")
 })




// add to followers for inviting people by search functionality ---username---.

app.post("/addContacts/:userId", async(req, res) => {
    // console.log(req.params)
    // console.log(req.body)

    try{
        //Search for a friend in db. (Data from req)
        const newFriend = [];
        const findFriendInDb = await User.find({ name: req.body.contactName})
        .then((findFriendInDb) => 
            findFriendInDb.map((f) => {
                const friendDetails = {
                    id: f._id
                }
                newFriend.push(friendDetails)

            })
            // ,res.status(200).json(data)
        )
        .catch((err) => console.log(err))

        // returning d var search friend doesn't hold data so i used an
        // array newFriend to hold just the searchFriend id. (By mapping)
        
        // console.log(newFriend[0].id)
        
        //
        if(newFriend[0].id !== req.params.userId){
            const AddNewFriend = []
            await User.find({_id: req.params.userId})
            .then((data) =>
                data.map((u) => {
                    const userDetails = {
                        id: u._id,
                        followers: u.followers
                    }
                    AddNewFriend.push(userDetails)
                }),
                
                // ,res.status(200).json(findUserFollowerModel)
            )

            .catch((err) => console.log(err))
            
            // console.log(AddNewFriend[0].followers)


            //
            if (AddNewFriend[0].followers.includes(newFriend[0].id)){
                res.status(400).send("This contact already exists on your profile")

            }
            else{
                const AddNewFollower = await User.findOneAndUpdate({_id:req.params.userId}, {
                    $push: {followers: newFriend[0].id}
                })
                .then((AddNewFollower) =>
                    res.status(200).json(AddNewFollower))
                .catch((err) => console.log(err))

                (newFriend[0].id.followers.includes(AddNewFriend[0].id)) ?
                    res.status(400).send("your receiver already knows you") :
                    await User.findOneAndUpdate({_id: newFriend[0].id}, {
                        $push: {followers: AddNewFriend[0].id}
                    })
                    .then((data) =>
                    res.status(200).json(data))
                    .catch((err) => console.log(err))
                
            }
            // res.status(200).json(newFollower)
           
            
        }
        else{
            res.status(400).send("failed to do that kind of stuff")
        }

    }
    catch{(err) => console.log(err)}
    
})


// contact of a particular user

app.get("/followers/:userId", async(req,res) => {
    const contact = []
    try{
    await User.find({_id:req.params.userId})
    .then((data) =>
    data.map((f) =>{ 
        const contactDetails = {
            follower: f.followers
        }
        contact.push(contactDetails)
    }))
    .catch(err => console.log(err))
    // console.log(contact[0].follower)
    

    if(contact[0].follower.length !== 0){    
    const contactList = await User.find({_id: {$in: contact[0].follower}})    
    res.status(200).json(contactList)
    
    }
    else{
        res.status(200).send(["you do not have any contact"])
    }
        
}catch{ err => console.log(err)}
    // console.log(data)
})






app.get("/findUsers/:senderId", async(req, res) => {

    const user = await User.findOne({_id: req.params.senderId })
    .then((user) => res.status(200).json(user))
    .catch(console.log)

    
})









const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
    },
  });


  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when connect
    console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("currentUserInfo", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
      console.log(users)
    });



    const offline = new queueOffline
    //send and get message
    socket.on("sendMessage", ({ sender, senderPicture, receiverId, message }) => {
      const initiator = getUser(sender);
      const findreceiver = getUser(receiverId)

      const receiver =  [initiator.socketId,  findreceiver === undefined ? offline.enqueue( {sender,
            senderPicture,
            message,})  : getUser(receiverId)]
        
      console.log(offline)

    //   const finalreceptors = [ initiator.socketId, receiver.socketId]
    //   console.log(sender, senderPicture, receiverId, message )
    //   console.log(finalreceptors)

        // if(socket.connected){
        io.to(receiver).emit("getUserMessage", {
            sender,
            senderPicture,
            message,
            });
    // }
    });
 

    socket.on("createFriend", ({ sender, senderName, senderPicture, contactId, contactPhoto, contactName, }) => {
        const initiator = getUser(sender);
        const receptor = getUser(contactId);
        console.log(sender, senderName, senderPicture, contactId, contactName, contactPhoto )
        const receivers = [receptor.socketId, initiator.socketId]
        
        io.to(receivers).emit("getCreatedFriend", {
            sender,
            senderName,
            senderPicture,
            contactId,
            contactName,
            contactPhoto
        }); 
      });


    socket.on("sendChannelMessage", ({ sender, senderPicture, appStateChannelId, message }) => {
      console.log(`from socket ${sender}, ${senderPicture}, ${appStateChannelId}, ${message}` )
        
      if (appStateChannelId) {
            io.emit("getChannelMessage", {
            sender,
            senderPicture,
            message,
            });
        }
      });



    socket.on("createChannel", ({ channelId, creator, channelName }) => {
        const creater = getUser(creator);
        const receiver = creater.socketId
        console.log("from socks "+creater, channelName )

        io.to(receiver).emit("getCreatedChannel", {
            channelId,
            creator,
            channelName,
        });

      });





    //when a user logsout
    socket.on("logout", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });

  


  // listen on port

server.listen(port, () => {console.log(`server started on ${port}`)})
