const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    roomName: String,
    guests: [Object], 
    roomPassword: String,
    host: String,
    description: String,
    tags: [String],
    queue: [Object],
    theme: String, 
    hotsPassword: String,
    size: Number
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room