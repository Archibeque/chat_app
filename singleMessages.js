const mongoose = require('mongoose')


const singlemessageschema = new mongoose.Schema({
    oneToOneChatUsers: {
        type: Array,
        default: []
    },
    conversation: [
        {
        message: String,
        timestamp: String,
        sender: String,
        senderPicture: String,
        }
    ],
    receipientPicture: String,
    receipientName: String,
    senderPicture: String,
    senderName: String,
})



module.exports =  mongoose.model('singleMessage', singlemessageschema)
