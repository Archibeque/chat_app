 const express = require('express')
 const router = express.Router()
 const messages = require('../channelMessages')




 // Group Chat
router.post('/channel', async (req, res) => {
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
router.get('/channelList/:id', (req,res) => {
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
                    name: channelData.channelName,
                    admin: channelData.user
                    
                }
                channels.push(channelInfo)
            })
            res.status(200).send(channels)
        }
    })
})


router.put('/message', (req,res) => {
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


router.get('/messageList/:channelId', (req,res) => {
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
router.post("/addGroupContact/:channelId/:userId/:newContactId", async(req, res) => {
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





 module.exports = router