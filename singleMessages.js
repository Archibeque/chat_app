const mongoose = require('mongoose')


const singlemessageschema = new mongoose.Schema({
    oneToOneChatUsers: {
        type: Array,
        default: []
    },
    conversation: [
        {
        message: String,
        timestamp: String
        }
    ],
})



module.exports =  mongoose.model('singleMessage', singlemessageschema)
