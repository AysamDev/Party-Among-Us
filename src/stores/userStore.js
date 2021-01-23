import { makeObservable, observable, action, computed} from 'mobx';
import axios from 'axios';
import io from "socket.io-client";
import {
    ASK_FOR_VIDEO_INFORMATION, JOIN_ROOM, LEAVE_ROOM, SUGGEST_SONG, NEW_SONG, VOTE_SONG
} from '../Constants';

const socketUrl = "http://localhost:4200";

export class UserStore {
    constructor() {
        this.socket = io(socketUrl)
        this.getRooms()
        this.room = {}
        this.rooms = []
        this.player_x = 350
        this.player_y = 350
        this.userName = ""
        this.avatar = ""
        this.currVidId = ''
        this.vidPlayer = null
        this.currentVidTime = 0
        this.nextVidId = ''
        this.avatars = [
            { name: "spritePlayer0", src: "./img/avatar_red.png" },
            { name: "spritePlayer1", src: "./img/avatar_yellow.png" },
            { name: "spritePlayer2", src: "./img/avatar_orange.png" },
            { name: "spritePlayer3", src: "./img/avatar_white.png" },
            { name: "spritePlayer4", src: "./img/avatar_lime.png" },
            { name: "spritePlayer5", src: "./img/avatar_pink.png" },
            { name: "spritePlayer6", src: "./img/avatar_cyan.png" },
            { name: "spritePlayer7", src: "./img/avatar_black.png" },
            { name: "spritePlayer8", src: "./img/avatar_purple.png" },
            { name: "spritePlayer9", src: "./img/avatar_blue.png" }
        ]

        this.genres = ["Blues", "Classical", "Hip-Hop",
            "Children", "Comedy", "Dance", "Electronic",
            "Pop", "Jazz", "Anime", "K-Pop", "Opera",
            "Rock", "Vocal", "Arabic"]

        this.themes = [
            { name: "Icy", value: "theme1" },
            { name: "Sky", value: "theme2" },
            { name: "Thunder", value: "theme3" },
            { name: "Halloween1", value: "theme4" },
            { name: "Halloween2", value: "theme5" },
            { name: "WildZone", value: "theme6" },
            { name: "Medieval", value: "theme7" },
            { name: "Disco", value: "theme8" },
            { name: "DiscoStar", value: "theme9" },
            { name: "PlantWorld", value: "theme10" },
            { name: "DJ.Penguin", value: "theme11" },
            { name: "Splash", value: "theme12" },
            { name: "Astro", value: "theme13" },
            { name: "Snowy", value: "theme14" },
        ]

        makeObservable(this, {
            rooms: observable,
            userName: observable,
            avatar: observable,
            room: observable,
            player_x: observable,
            player_y: observable,
            vidPlayer: observable,
            currVidId: observable,
            currentVidTime: observable,
            nextVidId: observable,
            createRoom: action,
            removeSong: action,
            getRoom: action,
            getRooms: action,
            setRoom: action,
            addUser: action,
            suggestSong: action,
            LeaveRoom: action,
            addLike: action,
            deleteRoom: action,
            listenToSocket: action,
            sortQueue: computed,
        })
        this.listenToSocket()
    }
    
    listenToSocket(){
        this.socket.on(NEW_SONG, (data) => {
            const {id, song} = data
            this.room.queue.push({id, song, votes: 1})
        })

        this.socket.on(VOTE_SONG, (data) => {
            const {songID, value} = data
            this.room.queue.find(q => q.id === songID).votes += value
        })

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

    compareSongs(a, b){
        if (a.votes > b.votes) {
            return -1
        } else if (a.votes < b.votes) {
            return 1
        } else {
            return 0
        }
    }

    get sortQueue(){
        return [...this.room.queue].sort(this.compareSongs)
    }

    getTop10() {
        return [...this.rooms].sort(this.compare)
    }

    async addLike(songID, unlike) {
        try {
            const value = unlike ? -1 : 1
            this.room = (await axios.put(`http://localhost:4200/vote/${this.room._id}/${songID}/${value}`)).data
            this.socket.emit(VOTE_SONG, { room: this.room._id, songID, value })
        } catch (error) {
            console.log(error)
        }
    }

    async createRoom(roomName, roomPassword, description, tags, theme, userName, avatar) {
        try {
            const host = this.socket.id
            this.avatar = this.avatars.find(a => a.name === avatar)
            this.userName = userName
            const guests = []
            guests.push({id: this.socket.id, userName, avatar})
            const hostPassword = this.socket.id
            const room = { roomName, guests, roomPassword, host, description, tags, queue: [], theme, hostPassword, size: 10 }
            this.room = (await axios.post("http://localhost:4200/room", room)).data
            this.socket.emit(JOIN_ROOM, {
                room: this.room._id
            })            
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
            await axios.delete(`http://localhost:4200/delete/${this.room._id}/${this.socket.id}/guests`)
            this.room = null
            this.getRooms()
            this.socket.emit(LEAVE_ROOM);
        } catch (error) {
            console.log(error)
        }
    }

    async deleteRoom() {
        try {
            await axios.delete(`http://localhost:4200/room/${this.room._id}`)
            this.room = null
            this.getRooms()
        } catch (error) {
            console.log(error)
        }
    }

    async suggestSong(id, song) {
        try {
            const newVal = {id, song, votes: 1}
            this.room = (await axios.put(`http://localhost:4200/add/${this.room._id}/queue`, newVal)).data
            console.log(this.room)
            this.socket.emit(SUGGEST_SONG, {
                room: this.room._id,
                song: song,
                id: id
            })
        } catch (error) {
            console.log(error)
        }
    }

    async removeSong(vidId){
        try {
            this.room = (await axios.delete(`http://localhost:4200/delete/${this.room._id}/${vidId}/queue`)).data
            console.log(this.room.queue)
            console.log('hello?')
            this.room.splice(0, 1) ///////////////come back to this
        } catch (error) {
            console.log(error)
        }
    }

    async addUser(userName, avatar) {
        try {
            this.userName = userName
            this.avatar = this.avatars.find(a => a.name === avatar)
            const body = { id: this.socket.id, userName, avatar }
            this.room = (await axios.put(`http://localhost:4200/add/${this.room._id}/guests`, body)).data
            this.socket.emit(JOIN_ROOM, {
                room: this.room._id,
                player: {
                    playerId: this.socket.id,
                    userName: this.userName,
                    avatar: this.avatar.name,
                    x: this.player_x,
                    y: this.player_y,
                    theme: this.room.theme
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

}