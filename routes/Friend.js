const express = require('express')
const router = express.Router()
const sm = require("../singleMessages")
const User = require('../users')




// router.post()
// one to one chat 
router.post('/new/singlemessage/:userId/:receiverId', async(req, res) => {
    console.log(req.params)
    const { ReceipientName, SenderName, senderPicture } = req.body
    const ids = [req.params.userId, req.params.receiverId]
    const receipientpics = await User.findById({_id: req.params.receiverId})
    const singlemessage = new sm({ oneToOneChatUsers:[req.params.userId, req.params.receiverId], receipientName: ReceipientName, senderName: SenderName, senderPicture, receipientPicture: receipientpics.photo})
    try {
        let foundMessages = []
        await sm.find({oneToOneChatUsers: {$all: [req.params.receiverId, req.params.userId]}})
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
        
        if(foundMessages.length === 0){
            var seeam = await singlemessage.save()
            res.status(200).json(seeam)
            console.log(seeam)
        }
        else if(foundMessages[0].oneToOne.includes(req.params.receiverId)){
            if(foundMessages[0].oneToOne.includes(req.params.userId)){
            res.status(200).json(foundMessages[0])
            }
        }
        // else{
            
        // }
        
    }
        //    
     catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
    
   // created 1 to 1 chat system
})


//message btw 1 to 1 users
router.post("/singlemessage/:userId", async(req, res) => {

    console.log(req.body)
    const { singlechatId, message, timestamp, sender, senderPicture } = req.body
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
        
        )
        .catch(console.log)

        
        console.log(singleChatClient)
        if(singleChatClient[0].oneToOneChatUsers.includes(req.params.userId)){

            // const gh = new sm({conversation:{message, timestamp}})
            await sm.findOneAndUpdate({_id: singlechatId}, {$push:{conversation: {message, timestamp, sender, senderPicture}}})
            .then((data) => res.status(200).json(data))
            .catch(console.log)
            console.log(data)
        }
        else{
            res.status(400).send("Sorry you can't chat someone you don't know")
        }
    }
    catch{err => console.log(err)    }
    
})


//get messages btw 1 to 1 users
router.get("/singlemessage/:messageId", async(req,res) => {
    const { userId } = req.params
    const { messageId } = req.params
    try{
        await sm.find({_id: messageId})
        .then((data) => res.status(200).json(data))
        .catch(console.log)

    }
    catch{err => console.log(err)}
})


//get singlemessagelist  for sidebar

router.get('/new/singleMessageList/:userId', (req,res) => {
    // console.log(req.body)
    sm.find({oneToOneChatUsers:{$in : req.params.userId}},
        (err,data) => {
        if (err) {
            res.status(500).send(err)
        }
        else{
            console.log("rugged" + data)
            let singlemessageList = []
            data.map((singleData) => {
                const singleInfo = {
                    id: singleData._id,
                    bin: singleData.oneToOneChatUsers.shift(),
                    name: singleData.oneToOneChatUsers,
                    receiverName: singleData.receipientName,
                    receiverPicture: singleData.receipientPicture,
                    senderName: singleData.senderName,
                    senderPicture: singleData.senderPicture
                }
                singlemessageList.push(singleInfo)
            })
            res.status(200).send(singlemessageList)
            // console.log(singlemessageList)

        }
    })
})



module.exports = router