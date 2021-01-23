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
  JOIN_ROOM, ADD_PLAYER, MOVE_PLAYER, SEND_MESSAGE, RECEIVED_MESSAGE, PLAYER_MOVED } = require('./src/Constants');

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

//initialize db
mongoose.connect(URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 })
  .then(function () {
    server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch(function (err) {
    console.log(err.message);
  });

io.on('connection', function (socket) {
  socket.on(JOIN_ROOM, async (data) => {
    await socket.join(data.room);
    socket.to(data.room).emit(ADD_PLAYER, data.player);
    socket.emit(ASK_FOR_VIDEO_INFORMATION, data);
  });

  socket.on(PLAY, (data) => {
    socket.to(data.room).emit(PLAY);
  });

  socket.on(PAUSE, (data) => {
    socket.to(data.room).emit(PAUSE);
  });

  socket.on(SYNC_TIME, (data) => {
    socket.to(data.room).emit(SYNC_TIME, data);
  });

  socket.on(NEW_VIDEO, (data) => {
    io.to(data.room).emit(NEW_VIDEO, data);
  });

  socket.on(ASK_FOR_VIDEO_INFORMATION, (data) => {
    socket.to(data.room).emit(ASK_FOR_VIDEO_INFORMATION);
  });

  socket.on(SYNC_VIDEO_INFORMATION, (data) => {
    io.to(data.room).emit(SYNC_VIDEO_INFORMATION, data);
  });

  socket.on(MOVE_PLAYER, (data) => {
    socket.to(data.room).emit(PLAYER_MOVED, data);
  });

  socket.on(SEND_MESSAGE, (data) => {
    socket.to(data.room).emit(RECEIVED_MESSAGE, data);
  });
});