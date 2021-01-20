import { makeObservable, observable, action} from 'mobx';
import axios from 'axios';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:4200";


export class UserStore{
    constructor(){
        this.socket = socketIOClient(ENDPOINT)
        this.getRooms()

        this.avatars = [
            {name: "red" , src: "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png?w=640"},
            {name: "white", src: "https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"},
            {name: "orange" , src: "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png?w=640"},
            {name: "yellow", src: "https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"},
            {name: "pink" , src: "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png?w=640"},
            {name: "purple", src: "https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"},
            {name: "blue", src: "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png?w=640"},
            {name: "cyan", src: "https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"},
            {name: "lime", src: "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png?w=640"},
            {name: "black", src: "https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"},
        ]
        
        this.genres = ["Blues", "Classical", "Hip-Hop",
                        "Children", "Comedy", "Dance", "Electronic",
                        "Pop", "Jazz", "Anime", "K-Pop", "Opera",
                        "Rock", "Vocal", "Arabic" ]
    
        this.themes=[
            {name: "Icy", value: "theme1"},
            {name: "Sky", value: "theme2"},
            {name: "Thunder", value: "theme3"},
            {name: "Halloween1", value: "theme4"},
            {name: "Halloween2", value: "theme5"},
            {name: "WildZone", value: "theme6"},
            {name: "Medieval", value: "theme7"},
            {name: "Disco", value: "theme8"},
            {name: "DiscoStar", value: "theme9"},
            {name: "PlantWorld", value: "theme10"},
            {name: "DJ.Penguin", value: "theme11"},
            {name: "Splash", value: "theme12"},
            {name: "Astro", value: "theme13"},
            {name: "Snowy", value: "theme14"},
        ]
        // this.images = [
        //     {
        //         id : 1,
        //         src: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
        //     },
        //     {
        //         id : 2,
        //         src: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616__340.jpg'
        //     },
        //     {
        //         id : 3,
        //         src: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
        //     }
        // ]

        this.rooms = []
        this.room = {}
        this.userName = ""
        this.avatar = ""
        makeObservable(this, {
            rooms: observable, //
            userName: observable,//
            avatar: observable,//
            room: observable,//
            createRoom: action,//
            getRoom: action, //
            getRooms: action,//
            setRoom: action,//
            addUser: action,//
            suggestSong: action,//
            LeaveRoom: action,//
            addLike: action,
            deleteRoom: action,//
        })
    }

    async getRooms(){
        try {
            const result = (await axios.get("http://localhost:4200/rooms")).data
            this.rooms = result 
        } catch (error) {
            return error
        }
    }

    async setRoom(room){
        this.room = room

    }

    compare(a, b){
        if(a.guests.length > b.guests.length){
            return -1 
        }else if(a.guests.length < b.guests.length){
            return 1
        }else{
            return 0
        }
    }

    getTop10(){
        return [...this.rooms].sort(this.compare)
    }

    async addLike(songID, unlike){
        try {
            const song = this.room.queue.find(q => q.id === songID)
            song.votes = unlike ? song.votes-1 : song.votes+1
            const body = { newVal: this.room.queue, field: 'queue'}
            this.room = (await axios.put(`http://localhost:4200/room/${this.room._id}`,body)).data
        } catch (error) {
            console.log(error)
        }
    }

    async createRoom(roomName, roomPassword, description, tags, theme){
        //roomName, guests, roomPassword, host, description, tags, queue, theme, hostPassword, size
        try {
            const guests = []
            const host = this.socket.id
            const hostPassword = this.socket.id
            const room = {roomName, guests, roomPassword, host, description, tags, queue:[], theme, hostPassword, size: 10}
            console.log(room)
            const response = (await axios.post("http://localhost:4200/room", room)).data
            console.log(response)
            await this.getRooms()
            this.room = response
        } catch (error) {
            console.log(error)
        }
    }

    async getRoom(){
        try {
            const result = (await axios.get(`http://localhost:4200/room/${this.room._id}`)).data
            this.room = result
        } catch (error) {
            console.log(error)
        }
    }

    async LeaveRoom(){
        try {       
            const response = (await axios.delete(`http://localhost:4200/delete/${this.room._id}/${this.socket.id}/guests`)).data
            this.room = null
            this.getRooms()
        } catch (error) {
            console.log(error)
        }
    }

    async deleteRoom(){
        try {
            const response = await axios.delete(`http://localhost:4200/room/${this.room._id}`)
            this.room = null
            this.getRooms()
        } catch (error) {
            console.log(error)
        }
    }

    async suggestSong(id, song){
        try {
            const newVal = {newObj: {id, song, votes: 1}}
            this.room = (await axios.put(`http://localhost:4200/add/${this.room._id}/queue`, newVal)).data
            console.log(this.room)
        } catch (error) {
            console.log(error)
        }
    }

    async sendMessage(message){//sending it using socket
        try {
            
        } catch (error) {
            
        }
    }

    async addUser(userName, avatar){
        try {
            this.userName = userName
            this.avatar = this.avatars.find(a => a.name === avatar)
            const body = {newObj: {id: this.socket.id, userName, avatar}}
            this.room = (await axios.put(`http://localhost:4200/add/${this.room._id}/guests`, body)).data
        } catch (error) {
            console.log(error)
        }
    }

}