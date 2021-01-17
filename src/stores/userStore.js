import { makeObservable, observable, action} from 'mobx'
import axios from 'axios'

export class UserStore{
    constructor(){
        this.socket = null
        this.avatars = [
            {name: "man", src: "https://koolinus.files.wordpress.com/2019/03/avataaars-e28093-koolinus-1-12mar2019.png?w=640"},
            {name: "woman", src: "data:image/jpeg;base64,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"},
            {name: "guy", src: "https://user-images.githubusercontent.com/5709133/50445980-88299a80-0912-11e9-962a-6fd92fd18027.png"},
        ]
        this.genres = ["Blues", "Classical", "Hip-Hop",
                        "Children", "Comedy", "Dance", "Electronic",
                        "Pop", "Jazz", "Anime", "K-Pop", "Opera",
                        "Rock", "Vocal", "Arabic" ]
        this.images = [
            {
                id : 1,
                src: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
            },
            {
                id : 2,
                src: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616__340.jpg'
            },
            {
                id : 3,
                src: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
            }
        ]
        this.rooms = [
            {
                id: 1,
                roomName: 'legends',
                guests: [{username: "shorouq", avatar: 1, id:'1s'}, {username: "ala", avatar: 2, id:'2s'}, {username: "suha", avatar: 3, id:'3s'}, {username: "musa", avatar: 4, id:'4s'}], 
                roomPassword: '1rp',
                host: '1s',
                description: "testing room",
                tags: ["Rock"],
                queue: [{id: 1, song: "someone like you", votes: 3}, {id: 2, song: "no promises", votes: 0} , {id: 3, song: "believer", votes: 2}],
                theme: 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
                hostPassword: '1hp',
                size: 10
            },
            {
                id: 2,
                roomName: 'killers',
                guests: [{username: "shorouq", avatar: 1, id:'1s'}, {username: "ala", avatar: 2, id:'2s'}, {username: "suha", avatar: 3, id:'3s'}], 
                roomPassword: '1rp',
                host: '1s',
                description: "testing room",
                tags: ["Classical"],
                queue: [{id: 1, song: "someone like you", votes: 3}, {id: 2, song: "no promises", votes: 0} , {id: 3, song: "believer", votes: 2}],
                theme: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616__340.jpg', 
                hostPassword: '1hp',
                size: 10},
            {
                id: 3,
                roomName: 'heroes',
                guests: [{username: "shorouq", avatar: 1, id:'1s'}, {username: "suha", avatar: 3, id:'3s'}], 
                roomPassword: '1rp',
                host: '1s',
                description: "testing room",
                tags: ["Jazz"],
                queue: [{id: 1, song: "someone like you", votes: 3}, {id: 2, song: "no promises", votes: 0} , {id: 3, song: "believer", votes: 2}],
                theme: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg', 
                hostPassword: '1hp',
                size: 10}
        ]
        this.room =  {
            id: 2,
            roomName: 'killers',
            guests: [{username: "shorouq", avatar: 1, id:'1s'}, {username: "ala", avatar: 2, id:'2s'}, {username: "suha", avatar: 3, id:'3s'}], 
            roomPassword: '1rp',
            host: '1s',
            description: "testing room",
            tags: ["classic"],
            queue: [{id: 1, song: "someone like you", votes: 3}, {id: 2, song: "no promises", votes: 0} , {id: 3, song: "believer", votes: 2}],
            theme: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616__340.jpg', 
            hostPassword: '1hp',
            size: 10
        }

        this.userName = "shorouq"
        this.avatar = 1
        makeObservable(this, {
            rooms: observable,
            userName: observable,
            avatar: observable,
            room: observable,
            createRoom: action,
            getRoom: action,
            addUser: action,
            suggestSong: action,
            LeaveRoom: action,
            addLike: action,
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

    async addLike(songID){
        try {
            // const result = await axios.put(`http://localhost:4200/update`)
             this.room.queue.find(q => q.id === songID).votes += 1
        } catch (error) {
            console.log(error)
        }
    }

    async createRoom(roomName, guests, roomPassword, host, description, tags, queue, theme, hostPassword, size){
        try {
            const room = {roomName, guests, roomPassword, host, description, tags, queue, theme, hostPassword, size}
            // const response = await axios.post("http://localhost:4200/room", room)
            // this.room = response
            this.rooms.push(room)
            this.room = room
        } catch (error) {
            console.log(error)
        }
    }

    async getRoom(roomID){
        try {
            // const result = (await axios.get(`http://localhost:4200/room/${roomID}`)).data
            // this.room = result
            this.room = this.rooms.find(r => r.id === roomID)
        } catch (error) {
            console.log(error)
        }
    }

    async LeaveRoom(){//remove by socket id 
        try {       
            this.room.guests.splice(this.room.guests.findIndex(g => this.userName === g.username),1)
        } catch (error) {
            console.log(error)
        }
    }

    async deleteRoom(roomID){//only if hostID is the same as the user socketID
        try {
            // const response = await axios.delete(`http://localhost:4200/room/${roomID}`)
            this.rooms.splice(this.rooms.findIndex(e => e.roomID === roomID), 1)
        } catch (error) {
            console.log(error)
        }
    }
    async suggestSong(id, song, votes){
        try {
            this.room.queue.push({id, song, votes})
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
            // const response = (await axios.put(`http://localhost:4200/update`)).data
            // this.room = response
            this.userName = userName
            this.avatar = this.avatars.find(a => a.name === avatar)
            this.room.guests.push({id: Math.random(), userName, avatar})
        } catch (error) {
            console.log(error)
        }
    }
}