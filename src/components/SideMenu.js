import React, { useState } from 'react';
import {TextField} from '@material-ui/core';
import Playlist from './Playlist';
import { observer, inject } from 'mobx-react';
import SuggestSong from './SuggestSong';
import axios from 'axios';
require('dotenv').config();

function SideMenu(props) {
    const {src} = props.UserStore.avatar,
    [song, setSong] = useState(""),
    [openSuggest, setOpenSuggest] = useState(false),
    [items, setItems] = useState([]);

    const search = async (event) => {
        if (event.key === 'Enter') {
            const {items} = (await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${song}&videoCategoryId=10&type=video&videoDuration=short&key=${process.env.REACT_APP_YOUTUBE}`)).data;
            setItems(items.map(i => ({title: i.snippet.title, id: i.id.videoId, channel: i.snippet.channelTitle.split(' ')[0] })));
            setOpenSuggest(true);
            setSong("");
        }
        else
            items.length && setItems([]);
    }

    return (
        <div id="sideMenu" >
            <div id="sideMenuHeader">
                <div id="avatarUser">
                    <img src={src} alt="avatar"/>
                    <h3>{props.UserStore.userName}</h3>
                </div>
                <div id="roomNameDesc">
                    <h2>{props.UserStore.room.roomName} </h2>
                    <p>{props.UserStore.room.description}</p>
                </div>
            </div>
            <Playlist />
            <TextField
                required label="Suggest Song"
                value={song}
                variant="outlined"
                id="song"
                onKeyPress = {search}
                onChange = {({target}) => setSong(target.value)}
            />
            {items.length && openSuggest ?  <SuggestSong items={items} openSuggest={setOpenSuggest}/> : null}
        </div>
    )
}

export default inject("UserStore")(observer(SideMenu));