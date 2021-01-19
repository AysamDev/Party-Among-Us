const express = require('express')
const mongoose = require('mongoose')
const api = require('./server/routes/api')
const PORT = process.env.PORT || 4200;
const URI = process.env.MONGODB_URI || 'mongodb://localhost/roomsDB';
const app = express()
const socket = require('socket.io')

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/', api)

mongoose.connect(URI,
  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000})

const server = app.listen(PORT, function () {
    console.log(`Running on port ${PORT}`)
})

const io = socket(server, {
    cors: {
      origin: '*',
    }
  })

io.on('connection', function(socket){
    console.log(socket.id)
})