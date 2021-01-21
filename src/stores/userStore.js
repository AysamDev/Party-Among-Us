import { makeObservable, observable, action } from 'mobx';
import axios from 'axios';
import io from "socket.io-client";
import {
    ASK_FOR_VIDEO_INFORMATION, JOIN_ROOM, ADD_PLAYER, PLAYER_MOVED
} from '../Constants';

const socketUrl = "http://localhost:4200";

export class UserStore {
    constructor() {
        this.socket = io(socketUrl)
        this.getRooms()
        this.onSocketMethods()
        this.room = null
        this.rooms = []
        this.player_x = 350
        this.player_y = 350
        this.userName = ""
        this.avatar = ""
        this.avatars = [
            { name: "man", src: "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png?w=640" },
            { name: "woman", src: "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png?w=640" },
            { name: "guy", src: "https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png" },
        ]
        this.genres = ["Blues", "Classical", "Hip-Hop",
            "Children", "Comedy", "Dance", "Electronic",
            "Pop", "Jazz", "Anime", "K-Pop", "Opera",
            "Rock", "Vocal", "Arabic"]
        this.images = [
            {
                id: 1,
                src: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
            },
            {
                id: 2,
                src: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616__340.jpg'
            },
            {
                id: 3,
                src: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
            }
        ]


        makeObservable(this, {
            rooms: observable,
            userName: observable,
            avatar: observable,
            room: observable,
            player_x: observable,
            player_y: observable,
            createRoom: action,
            getRoom: action,
            getRooms: action,
            setRoom: action,
            addUser: action,
            suggestSong: action,
            LeaveRoom: action,
            addLike: action,
            deleteRoom: action,
        })
    }

    onSocketMethods() {
        this.socket.on('connect', () => {

        });

        this.socket.on('disconnect', () => {
            if (this.room) {
                this.LeaveRoom()
            }
            console.log("Disconnected");
        });
    }

    async getRooms() {
        try {
            const result = (await axios.get("http://localhost:4200/rooms")).data
            this.rooms = result
        } catch (error) {
            return error
        }
    }

    async setRoom(room) {
        this.room = room

    }

    compare(a, b) {
        if (a.guests.length > b.guests.length) {
            return -1
        } else if (a.guests.length < b.guests.length) {
            return 1
        } else {
            return 0
        }
    }

    getTop10() {
        return [...this.rooms].sort(this.compare)
    }

    async addLike(songID, unlike) {
        try {
            const song = this.room.queue.find(q => q.id === songID)
            song.votes = unlike ? song.votes - 1 : song.votes + 1
            const body = { newVal: this.room.queue, field: 'queue' }
            this.room = (await axios.put(`http://localhost:4200/room/${this.room._id}`, body)).data
        } catch (error) {
            console.log(error)
        }
    }

    //save room to DB
    async createRoom(roomName, roomPassword, description, tags, theme) {
        //roomName, guests, roomPassword, host, description, tags, queue, theme, hostPassword, size
        try {
            const guests = []
            const host = this.socket.id
            const hostPassword = this.socket.id
            const room = { roomName, guests, roomPassword, host, description, tags, queue: [], theme, hostPassword, size: 10 }
            console.log(room)
            const response = (await axios.post("http://localhost:4200/room", room)).data
            console.log(response)
            await this.getRooms()
            this.room = response
        } catch (error) {
            console.log(error)
        }
    }

    async getRoom() {
        try {
            const result = (await axios.get(`http://localhost:4200/room`, this.room._id)).data
            this.room = result
        } catch (error) {
            console.log(error)
        }
    }


    async LeaveRoom() {
        try {
            const index = this.room.guests.findIndex(g => this.socket.id === g.id)
            this.room.guests.splice(index, 1)
            const body = { field: 'guests', newVal: this.room.guests }
            const response = (await axios.put(`http://localhost:4200/room/${this.room._id}`, body)).data
            this.room = null
            this.getRooms()
        } catch (error) {
            console.log(error)
        }
    }

    async deleteRoom() {
        try {
            const response = await axios.delete(`http://localhost:4200/room/${this.room._id}`)
            this.room = null
            this.getRooms()
        } catch (error) {
            console.log(error)
        }
    }

    async suggestSong(id, song) {
        try {
            this.room.queue.push({ id, song, votes: 1 })
            const newVal = { field: 'queue', newVal: this.room.queue }
            this.room = (await axios.put(`http://localhost:4200/room/${this.room._id}`, newVal)).data
        } catch (error) {
            console.log(error)
        }
    }

    async addUser(userName, avatar) {
        try {
            this.userName = userName
            this.avatar = this.avatars.find(a => a.name === avatar)
            this.room.guests.push({ id: this.socket.id, userName, avatar })
            const body = { field: 'guests', newVal: this.room.guests }
            this.room = (await axios.put(`http://localhost:4200/room/${this.room._id}`, body)).data
            this.socket.emit(JOIN_ROOM, {
                room: this.room._id,
                player: {
                    playerId: this.socket.id,
                    userName: this.userName,
                    avatar: this.avatar,
                    x: this.player_x,
                    y: this.player_y,
                    theme: this.room.theme
                }
            })
            this.socket.emit(ASK_FOR_VIDEO_INFORMATION);
        } catch (error) {
            console.log(error)
        }
    }
}