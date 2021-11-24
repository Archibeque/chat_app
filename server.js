const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const messages = require('./messages')
const User = require('./users')
const bcrypt = require("bcryptjs");
const passport = require("passport")
var sess = require('express-session')
// const usersRouter = require('./routes/users');
const Pusher = require("pusher");


// app config
const app = express()
const port = process.env.port || 5000


// middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(sess({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }))
  
app.use(passport.initialize())
app.use(passport.session())
require("./config/passport")(passport)

const pusher = new Pusher({
    appId: "1206828",
    key: "5cfa35d1fb08dbbee50b",
    secret: "da5ae2c696843cd96f6b",
    cluster: "mt1",
    useTLS: true
  });


//dbconfig
const connection_url = 'mongodb+srv://dblord:ready007@cluster0.xr77h.mongodb.net/chatbackenddb?retryWrites=true&w=majority'


// mongoose.connect(connection_url, {
//     useNewUrlParser: true, 
//     useUnifiedTopology: true, 
//     useCreateIndex: true,
//     useFindAndModify: false
// })
//     .then(console.log('mongodb connected'))
//     .catch(err => console.log(err))


const db = mongoose.connection


db.once('open', () => {
    console.log('db open')
    const changeStream = db.collection('conversations').watch()

    changeStream.on('change', (change) => {
        if (change.operationType === "insert") {
            pusher.trigger('channels', 'newchannel', {
                'change' : change
            })
        }
        else if (change.operationType === "update") {
            pusher.trigger('conversation', 'newmessage', {
                'change' : change
            })
        }

        else {
            console.log('error triggering pusher')
        }
        
    })


})

    
//api routes
app.get('/', (req,res) => {
    res.send('hello nigga')
})


app.post('/new/channel', (req, res) => {
    console.log(req.body)
    const dbData = req.body
    messages.create( dbData )
        .then((err,data) =>{
            if(err){
                res.status(500).send(err)
            }else{
                console.log(data)
            }
        })
        .catch(err => console.log(err))
})


app.get('/new/channelList', (req,res) => {
    messages.find((err,data) => {
        if (err) {
            res.status(500).send(err)
        }
        else{
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


app.post('/new/message', (req,res) => {
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


app.post('/register', (req,res) => {
    const {name, email, password, password2} = req.body

    const errors = []
    

    if(!name || !email || !password || !password2){
        JSON.stringify( errors.push({msg: 'please fill in all fields'}))
    }
    if(password.length <6){
        JSON.stringify(errors.push({msg: 'please ensure password is greater than 6 characters'}))
    }
    if(password !== password2){
    JSON.stringify(errors.push({msg: 'passwords do not match'}))
    }
  
    if(errors.length > 0){
    // res.render('index', { errors })
    res.status(400).json(errors)
    }
    else{
        User.findOne({email: email})
        .then(user => {	
          if(user) {
            errors.push({msg: 'Email is already registered'})
            // res.render('index', {errors	})
            res.status(400).json(errors)
        
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
                    res.status(201).json(user)
                })
                .catch(err => console.log(err))
  
              })
  
            })
          }
          
        })
        .catch(err => console.log(err))
      }

})


app.post("/login", (req, res, next) => {
    passport.authenticate('local', function(err, user, info) {
        // your logic to how you serve your user
        if(err){ return next(err); }

        if(user){
        var logged = user;
        return res.json({logged: logged});
        } else {
        return res.status(401).json(info);
        }
      })(req, res, next);
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



// listen on port

app.listen(port, () => {console.log(`app started on ${port}`)})