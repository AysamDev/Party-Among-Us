const express = require('express');
const mongoose = require('mongoose');
const api = require('./server/routes/api');
const PORT = process.env.PORT || 4200;
const URI = process.env.MONGODB_URI || 'mongodb://localhost/roomsDB';
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	cors: {
		origin: '*',
		allowedHeaders: ["content-type"]
	},
	pingInterval: 10000,
	pingTimeout: 5000
});

const { PLAY, PAUSE, SYNC_TIME, NEW_VIDEO, REMOVE_PLAYER,
	ASK_FOR_VIDEO_INFORMATION, SYNC_VIDEO_INFORMATION, NEW_SONG, SUGGEST_SONG, VOTE_SONG,
	JOIN_ROOM, ADD_PLAYER, MOVE_PLAYER, SEND_MESSAGE, RECEIVED_MESSAGE, PLAYER_MOVED, LEAVE_ROOM, API_PATH } = require('./src/Constants');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('node_modules'));

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

	next();
})

app.use(API_PATH, api);

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, connectTimeoutMS: 5000, serverSelectionTimeoutMS: 5000 })
	.then(function () {
		server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
	})
	.catch(function (err) {
		console.log(err.message);
	});

io.on('connection', function (socket) {
	let current_room;
	socket.on(JOIN_ROOM, async (data) => {
		await socket.join(data.room);
		data.player && socket.to(data.room).emit(ADD_PLAYER, data.player);
		socket.emit(ASK_FOR_VIDEO_INFORMATION, data);
	});

	socket.on(LEAVE_ROOM, () => {
		socket.to(current_room).emit(REMOVE_PLAYER, socket.id);
		current_room = null;
	});

	socket.on('disconnect', async(data) => {
		await socket.join(data.room);
		data.player && socket.to(data.room).emit(ADD_PLAYER, data.player);
		socket.emit(ASK_FOR_VIDEO_INFORMATION, data);
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

	socket.on(MOVE_PLAYER, (data) => {
		socket.to(data.room).emit(PLAYER_MOVED, data);
	});

	socket.on(SEND_MESSAGE, (data) => {
		socket.to(data.room).emit(RECEIVED_MESSAGE, data);
	});

	socket.on(SUGGEST_SONG, (data) => {
		socket.to(data.room).emit(NEW_SONG, data);
	})

	socket.on(VOTE_SONG, (data) => {
		socket.to(data.room).emit(VOTE_SONG, data);
	})
});