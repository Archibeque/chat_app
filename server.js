const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const messages = require('./channelMessages')
const sm = require("./singleMessages")
const User = require('./users')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs");
const http = require("http")
// const { Server } = require("socket.io")
const passport = require("passport")
var sess = require('express-session')
const usersRouter = require('./routes/users');
const Pusher = require("pusher");



// const { mongoUri } = require('config/keys')

var JWT_SECRET = 'abc123'

class error {
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
const port = process.env.port || 5000


// middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
// app.use(sess({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//   }))
  
// app.use(passport.initialize())
// app.use(passport.session())
// require("./config/passport")(passport)

// const pusher = new Pusher({
//     appId: "1206828",
//     key: "5cfa35d1fb08dbbee50b",
//     secret: "da5ae2c696843cd96f6b",
//     cluster: "mt1",
//     useTLS: true
//   });


//dbconfig
// const connection_url = 'mongodb+srv://dblord:ready007@cluster0.xr77h.mongodb.net/chatbackenddb?retryWrites=true&w=majority'
const connection_url = 'mongodb://localhost:27017/emmanuel'

mongoose.connect(connection_url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(console.log('mongodb connected'))
    .catch(err => console.log(err))


// const db = mongoose.connection


// db.once('open', () => {
//     console.log('db open')
//     const changeStream = db.collection('conversations').watch()

//     changeStream.on('change', (change) => {
//         if (change.operationType === "insert") {
//             pusher.trigger('channels', 'newchannel', {
//                 'change' : change
//             })
//         }
//         else if (change.operationType === "update") {
//             pusher.trigger('conversation', 'newmessage', {
//                 'change' : change
//             })
//         }

//         else {
//             console.log('error triggering pusher')
//         }
        
//     })


// })

    
//api routes
// app.get('/finduser/:senderId', async(req,res) => {
//     try{
//         await User.find({_id: req.params.senderId})
//         .then(data => {
//             res.status(200).json(data)
//         })
//         .catch(err => console.log(err))
//     }
//     catch{err => console.log(err)}
// })



// Group Chat
app.post('/new/channel', async (req, res) => {
    console.log(req.body)
    const dbData = req.body.channelName
    await messages.create({channelName: dbData, user: req.body.user.id, pool: req.body.user.id}),
    await User.findOneAndUpdate(
        { _id:  req.body.user.id },
        { $push: { isAdmin: req.body.channelName} },
        {upsert: true})
        
        .then((err,data) =>{
            if(err){
                res.status(500).send(err)
            }else{
                console.log(data)
               
            }
        })
        .catch(err => console.log(err))
    

    // await User.findOneAndUpdate(
    //     { _id:  req.body.user.id },
    //     { $push: { isAdmin: data.channelName} },
    //     {upsert: true},
    //     (err,data) => {
    //         if (err) {
    //             console.log(err)
    //             res.status(500).send(err)
    //         }
    //         else{
    //             console.log(data)
    //             res.status(200).send(data)
    //         }
    //     })
        

})

// get group channels a particular user belongs to
app.get('/new/channelList/:id', (req,res) => {
    // console.log(req.body)
    messages.find({pool:req.params.id},
        (err,data) => {
        if (err) {
            res.status(500).send(err)
        }
        else{
            console.log(data)
            let channels = []
            data.map((channelData) => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }
                channels.push(channelInfo)
            })
            res.status(200).send(channels)
        }
    })
})


app.put('/new/message', (req,res) => {
    console.log(req.body)
    const newMessage = req.body
    if(req.query.id != "null"){
    messages.findOneAndUpdate(
        { _id: req.query.id },
        { $push: { conversation: newMessage} },
        {upsert: true},
        (err,data) => {
            
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }
            else{
                res.status(200).send(data)
            }
    })
    }else{
        res.status(400).json("you have to select a channel or contact")
    }
})


app.get('/new/messageList/:channelId', (req,res) => {
    console.log(req.params)
    const id = req.params.channelId
    console.log(id)


    messages.find({_id: id})
    .then((data) => {
            console.log(data)
            // data.map((conversationData)=>{
            //     const recentMessage = {
            //         message: conversationData.message,
            //         timestamp: conversationData.timestamp,
            //         user: {
            //             displayName: conversationData.displayName,
            //             email: conversationData.email,
            //             photo: conversationData.photo,
            //             uid: conversationData.uid
            //         }
            //     }
            //     messages.push(recentMessage)
            // })
            // res.status(200).send(data)
            let m = []

            data.map((d) => {
                const recentMessage = {
                    conversationId: d._id,
                    message: d.conversation,
                    user: d.user,
                }
                m.push(recentMessage)
            })
            res.status(200).send(m)
            console.log(m)
        
    })
    .catch(console.log())
})

// ADD PEOPLE TO A GROUP - TO BE CARRIED OUT BY GROUP ADMIN.
// THIS MODEL WILL RELY ON CONTACTS.
app.post("/addGroupContact/:channelId/:userId/:newContactId", async(req, res) => {
    console.log(req.params.channelId, req.params.newContactId, req.params.userId)
    try{
        if(req.params.channelId && req.params.newContactId !== "null"){
            let barray = []
            const bry = await messages.find({_id: req.params.channelId, user: req.params.userId})
            // console.log(bry)
            .then((bry) =>
            bry.map((v) => {
            const detaild = {
            id: v._id,
            pool: v.pool
            }
            barray.push(detaild)
            }))
            .catch(err => console.log(err))

            console.log(barray[0])


            // console.log(bry)

            if(barray[0].pool.includes(req.params.newContactId)){
                res.status(500).send("Channel Participant exists already")
                
            }
            else{
                const addContact = await messages.findOneAndUpdate({_id: req.params.channelId}, {$push: {pool: req.params.newContactId}})
                res.status(200).json(addContact);
            }
        }   
        else{
            res.status(400).send("sorry you need to input the required details to carryout this operation")
            console.log("sorry statement")
        }

    }
    catch (err) {
        res.status(500).json(err);
    }
    // .then((data) => res.status(200).json(data))
    // .catch((err) => console.log(err))
    // if(req.params.id !== ""){
    //     const addParticipant = new messages({_id:channelId})
    // }
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
        if(newFriend[0].id !== req.params.id){
            const AddNewFriend = []
            await User.find({_id: req.params.id})
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
                const AddNewFollower = await User.findOneAndUpdate({_id:req.params.id}, {
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
        res.status(200).json("You do not have any contacts")
    }
        
}catch{ err => console.log(err)}
    // console.log(data)
})





// random users for invite for now
// app.get("/randomUser", async(req, res) => {
//     // console.log(req.body)
//     try{
//         await User.findOne({name: "fedr"})
//         .then((data) =>
//             res.status(200).json(data))
//             // console.log(data)
            
//         // )
//         .catch(err => {
//             res.status(400).json(err)
//             console.log(err)
//         })
//     }
//     catch{(err) => console.log(err)}
// })





// one to one chat 
app.post('/new/singlemessage/:userId/:receiverId', async(req, res) => {
    console.log(req.params)
    // const newMessage = req.body
    const ids = [req.params.userId, req.params.receiverId]
    
    const singlemessage = new sm({ oneToOneChatUsers:[req.params.userId, req.params.receiverId]})
    try {
        let foundMessages = []
        await sm.find({oneToOneChatUsers: {$all: req.params.receiverId}})
        .then((data) => data.map((r) => {
            const singleChatUsers = {
                id: r._id,
                oneToOne: r.oneToOneChatUsers
            }
            foundMessages.push(singleChatUsers)
        }))
        .catch(console.log)
        console.log(foundMessages)
        console.log(foundMessages[0])
        
        if(foundMessages.length == 0){
            var seeam = await singlemessage.save()
            res.status(200).json(seeam)
            console.log(seeam)
        }
        else if(foundMessages[0].oneToOne.includes(ids[1])){
            if(foundMessages[0].oneToOne.includes(ids[0])){
            res.status(200).json(foundMessages[0])
        }}
        else{
            
        }
        
        }
        //    
     catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
   // created 1 to 1 chat system
})

//message btw 1 to 1 users
app.post("/singlemessage/:userId", async(req, res) => {
    console.log(req.body)
    const { singlechatId, message, timestamp } = req.body
    try{
        singleChatClient = []
        await sm.find({_id: singlechatId})
        .then((data) => 
        data.map((sc) => {
            const singlechat = {
                oneToOneChatUsers: sc.oneToOneChatUsers
            }
            singleChatClient.push(singlechat)
        })
        // res.status(200).json(data)
        )
        
        console.log(singleChatClient)
        if(singleChatClient[0].oneToOneChatUsers.includes(req.params.userId)){

            // const gh = new sm({conversation:{message, timestamp}})
            await sm.findOneAndUpdate({_id: singlechatId}, {$push:{conversation: {message, timestamp}}})
            .then((data) => res.status(200).json(data))
            console.log(data)
        }
        else{
            res.status(400).send("Sorry you can't chat someone you don't know")
        }
    }
    catch{err => console.log(err)    }
    
})


//get messages btw 1 to 1 users
app.get("/singlemessage/:messageId", async(req,res) => {
    const { messageId } = req.params
    try{
        await sm.find({_id: messageId})
        .then((data) => res.status(200).json(data))
    }
    catch{err => console.log(err)}
})


















// auth
app.post('/register', async(req,res) => {
    const {name, email, password, password2} = req.body

    
    // const errors = []
    const errors = new error()


    

    if(!name || !email || !password || !password2){
        JSON.stringify( errors.enqueue({msg: 'please fill in all fields'}))
    }
    if(password.length <6){
        JSON.stringify(errors.enqueue({msg: 'please ensure password is greater than 6 characters'}))
    }
    if(password !== password2){
    JSON.stringify(errors.enqueue({msg: 'passwords do not match'}))
    }
  
    if(errors.count > 0){
    // res.render('index', { errors })
    // var displayError = Object.assign({}, errors)
    res.status(400).json(errors)
    console.log(errors)
    }
    else{
        User.findOne({email: email})
        .then(user => {	
          if(user) {
            errors.enqueue({msg: 'Email is already registered'})
            // res.render('index', {errors	})
            // var displayError = Object.assign({}, ...errors)
            res.status(400).json(errors)
            console.log(errors)

        
          }
          else{
            const newUser = new User({
              name,
              email,
              password
            })
            bcrypt.genSalt(10, (err, salt)=> {
                bcrypt.hash(newUser.password, salt, (err, hash) =>{
                if (err) throw err
                    newUser.password = hash
                    newUser.save()
                .then(user =>{
                //   res.redirect('/users/login')
                    res.status(201).json({
                        id: user.id,
                        name: user.name,
                        email: user.email
                    })
                    console.log(user)
                })
                .catch(err => console.log(err))
  
              })
  
            })
          }
          
        })
        .catch(err => console.log(err))
      }

})


app.post("/login", async(req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({ email })

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email
        })
        console.log(user)
    }
    else{
        res.status(400).json("Invalid User")
    }
})




  // // const email = req.body.email
  // // const password = req.body.password
  //   // const { email, password } = req.body;
    

  
// });

app.get("/findUsers/:senderId", async(req, res) => {

    const user = await User.findOne({_id: req.params.senderId })
    .then((user) => res.status(200).json(user))
    .catch(console.log)

    
})

// app.post("/register", (req, res) => {
//     const {name, email, password, password1} = req.body
//       // create errors array
//     const errors = []
    
//     if(!name || !email || !password || !password1){
//       errors.push({msg: 'please fill in all fields'})
//     }
//     if(password.length <6){
//       errors.push({msg: 'please ensure password is greater than 6 characters'})
//     }
//     if(password !== password1){
//       errors.push({msg: 'passwords do not match'})
//     }

//     if(errors.length > 0){
//       res.status(400).json(errors)
//     }
   
//     User.findOne({ email: req.body.email }).then((user) => {
//       if (user) {
//         return res.status(400).json({ email: "Email already exists" });
//       } else {
//         const newUser = new User({
//           name: req.body.name,
//           email: req.body.email,
//           password: req.body.password,
//         });
//         // hash
//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser
//               .save()
//               .then((user) => res.json(user))
//               .catch((err) => console.log(err));
//           });
//         });
//       }
//     });
//   });
  

// app.use('/users', usersRouter);


//  socket stuff
// var io = new Server(server)



// try{
//     //Search for a friend in db. (Data from req)
//     const newFriend = []
//     const searchfriend = await User.find({ name: req.body.contactName})
//     .then((data) =>
//     res.status(200).json(data))
//     .catch((err) => console.log(err))
//     // returning d var search friend doesn't hold data so i used an
//     // array newFriend to hold just the searchFriend id. (By mapping)
//     searchfriend.map((friendId) => {
//         const friendDetails = {
//             id: friendId._id
//         }
//         newFriend.push(friendDetails)

//     })
    
//     //
//     if(newFriend[0].id !== req.params.id){
//         const AddNewFriend = []
//         const findUserFollowerModel = await User.findOne({_id: req.params.id})
//         .then()
//         .catch((err) => console.log(err))
//         findUserFollowerModel.map((u) => {
//             const userDetails = {
//                 id: u._id,
//                 followers: u.followers
//             }
//             AddnewFriend.push(userDetails)
//         })

//         //
//         if (AddNewFriend[1].followers.includes(newFriend[0].id)){
//             res.status(400).send("This contact already exists on your profile")

//         }
//         else{
//             const AddNewFollower = await User.findOneAndUpdate({_id:req.params.id}, {
//                 $push: {followers: newFriend[0].id}
//             })
//             .then(
//                 res.status(200).json(AddNewFollower))
//             .catch((err) => console.log(err))
//         }
//         res.status(200).json(newFollower)
       
        
//     }
//     else{
//         res.status(400).send("failed to do that kind of stuff")
//     // }

// }
// // catch{(err) => console.log(err)}

// })







// listen on port

app.listen(port, () => {console.log(`app started on ${port}`)})