import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import Playlist from './Playlist';
import { observer, inject } from 'mobx-react';
import SuggestSong from './SuggestSong';
import Video from './Video';
import axios from 'axios';

function SideMenu(props) {
    const { src } = props.UserStore.avatar;
    const [song, setSong] = useState("");
    const [openSuggest, setOpenSuggest] = useState(false);
    const [items, setItems] = useState([]);

    const search = async (event) => {
        if (event.key === 'Enter') {
            const { items } = (await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${song}&videoCategoryId=10&type=video&videoDuration=short&key=${process.env.REACT_APP_YOUTUBE}`)).data;
            setItems(items.map(i => ({ title: i.snippet.title, id: i.id.videoId, channel: i.snippet.channelTitle.split(' ')[0] })));
            setOpenSuggest(true);
            setSong("");
            // console.log(`https://www.youtube.com/watch?v=${i.id.videoId}&ab_channel=${i.snippet.channelTitle.split(' ')[0]}`)
        }
        else {
            items.length && setItems([]);
        }
    }

    return (
        <div id="sideMenu" >
            <div id="sideMenuHeader">
                <div id="avatarUser">
                    <img src={src} alt="avatar" />
                    <h3>{props.UserStore.userName}</h3>
                </div>
                <div id="roomNameDesc">
                    <h2>{props.UserStore.room.roomName}</h2>
                    <p>{props.UserStore.room.description}</p>
                </div>
            </div>
            {props.UserStore.sortQueue[0] ? (props.UserStore.currVidId = props.UserStore.sortQueue[0].id, <Video />) : "Add A Song :)"}
            <Playlist />
            <TextField
                required label="Suggest Song"
                value={song}
                variant="outlined"
                id="song"
                onKeyPress={search}
                onChange={({ target }) => setSong(target.value)}
            />
            {items.length && openSuggest ? <SuggestSong items={items} openSuggest={setOpenSuggest} /> : null}
        </div>
    )
}

export default inject("UserStore")(observer(SideMenu));