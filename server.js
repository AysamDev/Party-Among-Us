const express = require('express');
const mongoose = require('mongoose');
const api = require('./server/routes/api');
const PORT = process.env.PORT || 4200;
const URI = process.env.MONGODB_URI || 'mongodb://localhost/roomsDB';
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    allowedHeaders: ["content-type"]
  }
});

const { PLAY, PAUSE, SYNC_TIME, NEW_VIDEO,
  ASK_FOR_VIDEO_INFORMATION, SYNC_VIDEO_INFORMATION,
  JOIN_ROOM } = require('./src/Constants');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('node_modules'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  next();
})

app.use('/', api);

mongoose.connect(URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 })
  .then(function () {
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch(function (err) {
    console.log(err.message);
  });

io.on('connection', function (socket) {
  socket.on(JOIN_ROOM, (data) => {
    socket.join(data.room);
    socket.room = data.room;
  });

  socket.on(PLAY, () => {
    socket.to(socket.room).emit(PLAY);
  });

  socket.on(PAUSE, () => {
    socket.to(socket.room).emit(PAUSE);
  });

  socket.on(SYNC_TIME, (currentTime) => {
    socket.to(socket.room).emit(SYNC_TIME, currentTime);
  });

  socket.on(NEW_VIDEO, (videoURL) => {
    io.to(socket.room).emit(NEW_VIDEO, videoURL);
  });

  socket.on(ASK_FOR_VIDEO_INFORMATION, () => {
    socket.to(socket.room).emit(ASK_FOR_VIDEO_INFORMATION);
  });

  socket.on(SYNC_VIDEO_INFORMATION, (data) => {
    io.to(socket.room).emit(SYNC_VIDEO_INFORMATION, data);
  });
});
