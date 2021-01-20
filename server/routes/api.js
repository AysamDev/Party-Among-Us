const express = require('express');
const router = express.Router();
const Room = require('../models/Room.js');
const axios = require('axios');
const apiKey = require('./credentials')

router.get('/sanity', function (req, res) {
    res.sendStatus(200);
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

router.put('/room/:roomID', async function (req, res) {
    try {
        const {newVal, field} = req.body
        const room = await Room.findOneAndUpdate({ _id: req.params.roomID }, { [field]: newVal }, { new: true });
        res.send(room);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

//save song to db
router.put('/addTrack/:roomID/:vidID/:vidTitle', async function (req, res) {
    const { roomID, vidID, vidTitle } = req.params
    const video = {id: vidID, title: vidTitle}
    try {
        const room = await Room.findOneAndUpdate({ _id: roomID }, { '$push': {queue: video} }, { new: true });
        res.send(room);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

//delete song from db
router.delete('/addTrack/:roomID/:vidID', async function (req, res) {
    const { roomID, vidID} = req.params
    try {
        const room = await Room.findOneAndUpdate({ _id: roomID }, { "$pull": { "queue": { "id": vidID } } }, { new: true });
        res.send(room);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

module.exports = router;