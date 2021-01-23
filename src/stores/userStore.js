import { makeObservable, observable, action } from 'mobx';
import axios from 'axios';
import io from "socket.io-client";
import { ASK_FOR_VIDEO_INFORMATION, JOIN_ROOM, LEAVE_ROOM, API_PATH, SERVER_PATH } from '../Constants';
const SERVER_URL = `${SERVER_PATH}${API_PATH}`;

export class UserStore {
    constructor() {
        this.socket = io(SERVER_PATH);
        this.getRooms();
        this.room = {};
        this.rooms = [];
        this.player_x = 815;
        this.player_y = 487;
        this.userName = "";
        this.avatar = "";
        this.avatars = [
            {name: "0" , src: "./img/avatar_red.gif"},
            {name: "1", src: "./img/avatar_yellow.gif"},
            {name: "2" , src: "./img/avatar_orange.gif"},
            {name: "3", src: "./img/avatar_white.gif"},
            {name: "4", src: "./img/avatar_lime.gif"},
            {name: "5" , src: "./img/avatar_pink.gif"},
            {name: "6", src: "./img/avatar_cyan.gif"},
            {name: "7", src: "./img/avatar_black.gif"},
            {name: "8", src: "./img/avatar_purple.gif"},
            {name: "9", src: "./img/avatar_blue.gif"}
        ];

        this.genres = ["Blues", "Classical", "Hip-Hop",
                        "Children", "Comedy", "Dance", "Electronic",
                        "Pop", "Jazz", "Anime", "K-Pop", "Opera",
                        "Rock", "Vocal", "Arabic" ];

        this.themes=[
            {name: "Snowy", value: "0"},
            {name: "Sky", value: "1"},
            {name: "Thunder", value: "2"},
            {name: "Halloween1", value: "3"},
            {name: "Halloween2", value: "4"},
            {name: "WildZone", value: "5"},
            {name: "Medieval", value: "6"},
            {name: "Disco", value: "7"},
            {name: "DiscoStar", value: "8"},
            {name: "PlantWorld", value: "9"},
            {name: "DJ.Penguin", value: "10"},
            {name: "Splash", value: "11"},
            {name: "Astro", value: "12"},
            {name: "Christmas", value: "13"}
        ];

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
            deleteRoom: action
        })
    }

    async getRooms() {
        try {
            const result = (await axios.get(`${SERVER_URL}/rooms`)).data;
            this.rooms = result;
        } catch (error) {
            return error;
        }
    }

    async setRoom(room) {
        this.room = room;
    }

    compare(a, b) {
        if (a.guests.length > b.guests.length)
            return -1;
        else if (a.guests.length < b.guests.length)
            return 1;
        else
            return 0;
    }

    getTop10() {
        return [...this.rooms].sort(this.compare);
    }

    async addLike(songID, unlike) {
        try {
            const value = unlike ? -1 : 1;
            this.room = (await axios.put(`${SERVER_URL}/vote/${this.room._id}/${songID}/${value}`)).data;
        }
        catch (error) {
            console.log(error);
        }
    }

    async createRoom(roomName, roomPassword, description, tags, theme) {
        //roomName, guests, roomPassword, host, description, tags, queue, theme, hostPassword, size
        try {
            const guests = [];
            const host = this.socket.id;
            const hostPassword = this.socket.id;
            const room = { roomName, guests, roomPassword, host, description, tags, queue: [], theme, hostPassword, size: 10 };
            console.log(room);
            const response = (await axios.post(`${SERVER_URL}/room`, room)).data;
            await this.getRooms();
            this.room = response;
        }
        catch (error) {
            console.log(error);
        }
    }

    async getRoom() {
        try {
            const result = (await axios.get(`${SERVER_URL}/room`, this.room._id)).data;
            this.room = result;
        } catch (error) {
            console.log(error);
        }
    }

    async LeaveRoom() {
        try {
            await axios.delete(`${SERVER_URL}/delete/${this.room._id}/${this.socket.id}/guests`);
            this.room = null;
            this.getRooms();
            this.socket.emit(LEAVE_ROOM);
        }
        catch (error) {
            console.log(error);
        }
    }

    async deleteRoom() {
        try {
            await axios.delete(`${SERVER_URL}/room/${this.room._id}`);
            this.room = null;
            this.getRooms();
        }
        catch (error) {
            console.log(error);
        }
    }

    async suggestSong(id, song) {
        try {
            const newVal = {newObj: {id, song, votes: 1}};
            this.room = (await axios.put(`${SERVER_URL}/add/${this.room._id}/queue`, newVal)).data;
        }
        catch (error) {
            console.log(error);
        }
    }

    async addUser(userName, avatar) {
        try {
            this.userName = userName;
            this.avatar = this.avatars.find(a => a.name === avatar);
            this.room.guests.push({ id: this.socket.id, userName, avatar });
            const body = { field: 'guests', newVal: this.room.guests };
            this.room = (await axios.put(`${SERVER_URL}/room/${this.room._id}`, body)).data;
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
            });

            this.socket.emit(ASK_FOR_VIDEO_INFORMATION);
        }
        catch (error) {
            console.log(error);
        }
    }
}