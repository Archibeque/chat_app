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
// app.get('/:id', (req,res) => {
//     try{
//         User.findOne({_id:req.params.id})
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
    await messages.create({channelName: dbData, user: req.body.user.id,}),
        User.findOneAndUpdate(
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
    messages.find({user:req.params.id},
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
})


app.get('/new/messageList', (req,res) => {
    const id = req.query.id

    messages.find({_id: id},  (err,data) => {
        if (err) {
            res.status(500).send(err)
        }
        else{
            // console.log(conversation.length)
            // let messages = []
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
            res.status(200).send(data)
        }
    })
})
















// add to followers for inviting people by search functionality ---username---.

app.post("/addContacts/:id", async(req, res) => {
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
        
        console.log(newFriend[0].id)
        
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
            
            console.log(AddNewFriend[0].followers)


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
            }
            // res.status(200).json(newFollower)
           
            
        }
        else{
            res.status(400).send("failed to do that kind of stuff")
        }

    }
    catch{(err) => console.log(err)}
    
})



// random users for friendlist for now
app.get("/randomUser", async(req, res) => {
    // console.log(req.body)
    try{
        await User.findOne({name: "fedr"})
        .then((data) =>
            res.status(200).json(data))
            // console.log(data)
            
        // )
        .catch(err => {
            res.status(400).json(err)
            console.log(err)
        })
    }
    catch{(err) => console.log(err)}
})





// one to one chat 
app.post('/new/singlemessage/:userId/:receiverId', async(req, res) => {
    console.log(req.params)
    // const newMessage = req.body
    const singlemessage = new sm({ oneToOneChatUsers:[req.params.userId, req.params.receiverId]})
    try {
       var seeam = await singlemessage.save()
       res.status(200).json(seeam)
       console.log(seeam)
    } catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
   // created 1 to 1 chat system
})

//message btw 1 to 1 users
app.post("/singlemessage/:userId", async(req, res) => {
    const { singlechatId, message, timestamp } = req.body
    try{
        const gh = await sm.findById({_id:singlechatId})
        gh.save({conversation:{message, timestamp}})
        .then((data) => res.status(200).json(data))
    }
    catch{err => console.log(err)    }
    
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