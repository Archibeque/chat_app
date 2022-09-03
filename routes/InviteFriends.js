const express = require('express')
const router = express.Router()
const User = require('../users')
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer")




router.post("/inviteName/:senderId", async(req, res, next) => {
    const { name } = req.body
    const { senderId } = req.params
    const user = await User.findOne({ name })
    const check = await User.findById({_id: senderId})
    if(check.followers.includes(user._id)){
        res.status(400).json(`${user.name} already exists on your contact list`)
    }
    else{
    if(user._id !== senderId){
        const addToSenderContact = await User.findByIdAndUpdate({_id: senderId},{$push: {followers : user._id} })
        if (user.followers.includes(check._id)){
            next()
        }
        else{
        const addToReceiverContact = await User.findByIdAndUpdate({_id: user._id},{$push: {followers : user._id} })

        }
        res.status(200).json(`${user.name} has been added`)
    }
    else if(user._id === senderId) {
        res.status(400).json("Cannot add yourself")
    }

    else{
        res.status(404).json("User Not found")
    }
    }    
})




router.post("/sendToMail/:senderId", async(req, res) => {
    const { senderId } = req.params
    const { email } = req.body
    const sender = await User.findById({_id: senderId})

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: ".com",
            pass: ""
        },
        secure: false,
        tls:{
            rejectUnauthorized: false
        }
    })
    
    const mailoptions = {
        from: 'no-reply@TapChat',
        to: email,
        subject: `Invitation Requests from ${sender.name}`,
        html: `<div class="container" style={{backgroundColor: #5f5b445b, height: 100vh, display: flex, justifyContent: center, align-items: center}}>
        <div>
            <h3>You have been invited to join Tap Chat By ${sender.name}</h3>
            <a href=localhost:/5000/register/withCredentials/${senderId} target="_blank">Click Here</a>
            <h4>
                Tap Chat is a private multi-messaging application designed by Nnadi Daniel
                for more info kindly drop a mail at <p><em><b>nnadidan360@gmail.com</b></em> or 
                <em><b>dannynnadi360@gmail.com</b></em> or call <strong>+2349032849814</strong></p>
            </h4>
            </div>
        </div>`
    }
    
    
    transporter.sendMail(mailoptions, (err, info) => {
        if(err){
            console.log(err)

        }
        else{
            console.log(info)
            res.status(200).send(info)

        }
    })


})



module.exports = router
