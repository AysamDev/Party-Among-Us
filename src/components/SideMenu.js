import React, { useEffect, useState } from 'react';
import { TextField } from '@material-ui/core';
import Playlist from './Playlist';
import { observer, inject } from 'mobx-react';
import SuggestSong from './SuggestSong';
import Video from './Video';
import axios from 'axios';
import { PLAY_SONG, SYNC_TIME } from '../Constants';

function SideMenu(props) {
    const { src } = props.UserStore.avatar,
    [song, setSong] = useState(""),
    [openSuggest, setOpenSuggest] = useState(false),
    [items, setItems] = useState([]),
    [videoComp, setVideoComp] = useState(null),
    {sortQueue, currVidId, socket, room, currentVidTime } = props.UserStore;

    const search = async (event) => {
        if (event.key === 'Enter') {
            const { items } = (await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${song}&videoCategoryId=10&type=video&videoDuration=short&key=${process.env.REACT_APP_YOUTUBE}`)).data;
            setItems(items.map(i => ({ title: i.snippet.title, id: i.id.videoId, channel: i.snippet.channelTitle.split(' ')[0] })));
            setOpenSuggest(true);
            setSong("");
            // console.log(`https://www.youtube.com/watch?v=${i.id.videoId}&ab_channel=${i.snippet.channelTitle.split(' ')[0]}`)
        }
        else
            items.length && setItems([]);
    }

    const getNextVideoID = () => {
        return props.UserStore.room.queue.reduce((max, q)=> {
            max = q.votes > max.votes ? q : max;
            return max;
        }, {votes: 0}).id;
    }

    useEffect(() => {
        const playVid = async () => {
            //return and assign currentVidId when on socket and also assign a starting point for non host users
            if(socket.id === room.host && !currVidId && sortQueue.length) {
                const vidId = getNextVideoID();
                const data = {
                    room: room._id,
                    song: vidId,
                    time: 0
                }
                socket.emit(PLAY_SONG, data);
                props.UserStore.setCurrVid(vidId);
                setVideoComp(<Video videoId={vidId} start={0} />);
                await props.UserStore.removeSong(vidId);
            }
            else if (currVidId && currVidId != sortQueue[0]) {
                setVideoComp(<Video videoId={currVidId} start={currentVidTime}/>);
            }
        }
        playVid();
    }, [room, sortQueue, currentVidTime, currVidId])

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
            {videoComp}
            <TextField
                required label="Suggest Song"
                value={song}
                variant="outlined"
                id="song"
                onKeyPress={search}
                onChange={({ target }) => setSong(target.value)}
            />
            <Playlist />
            {items.length && openSuggest ? <SuggestSong items={items} openSuggest={setOpenSuggest} /> : null}
        </div>
    )
}

export default inject("UserStore")(observer(SideMenu));