const express = require('express');
const router = express.Router();
const Room = require('../models/Room.js');
const axios = require('axios');

router.get('/sanity', function (req, res) {
    res.sendStatus(200);
});

router.get('/spotifyAPI', async function (req, res) {
    try {
        const spotifyData = await axios.get(``);
        res.send(spotifyData.data);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.get('/rooms', async function (req, res) {
    try {
        const rooms = await Room.find({});
        res.send(rooms);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.get('/room/:roomID', async function (req, res) {
    try {
        const room = await Room.findOne({ _id: req.params.roomID });
        res.send(room);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.post('/room', async function (req, res) {
    try {
        const room = new Room({ ...req.body });
        await room.save();
        res.send(room);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.delete('/room/:roomID', async function (req, res) {
    try {
        const room = await Room.findByIdAndRemove({ _id: req.params.roomID });
        res.send(room);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.put('/update/:roomName/:newRoomName', async function (req, res) {
    try {
        const room = await Room.findOneAndUpdate({ roomName: req.params.roomName }, { roomName: req.params.newRoomName }, { new: true });
        res.send(room);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})


module.exports = router;