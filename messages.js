const mongoose = require('mongoose')


const messageschema = new mongoose.Schema({
    channelName: String,
    conversation: [
        {
            message: String,
            timestamp: String
        }
    ]
})


module.exports =  mongoose.model('conversations', messageschema)