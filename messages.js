const mongoose = require('mongoose')


const messageschema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true
    },
    conversation: [
        {
            message: String,
            timestamp: String
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
})


module.exports =  mongoose.model('conversations', messageschema)