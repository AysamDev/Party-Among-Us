import React, { useState } from 'react'
import {Button, TextField} from '@material-ui/core';
import Playlist from './Playlist'
import { observer, inject } from 'mobx-react'
import { useHistory } from "react-router-dom";
import SuggestSong from './SuggestSong';
import axios from 'axios'
require('dotenv').config()

function SideMenu(props) {
    const {name, src} = props.UserStore.avatar
    const [song, setSong] = useState("")
    const [openSuggest, setOpenSuggest] = useState(false)
    const [items, setItems] = useState([])
    let history = useHistory()

    const leave = async () => {
        props.UserStore.LeaveRoom()
        history.push("/home")
    }

    const search = async (event) => {
        if (event.key === 'Enter') {
            console.log('pressedEnter')
            const {items} = (await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${song}&videoCategoryId=10&type=video&videoDuration=short&key=${process.env.REACT_APP_YOUTUBE}`)).data
            setItems(items.map(i => ({title: i.snippet.title, id: i.id.videoId, channel: i.snippet.channelTitle.split(' ')[0] })))
            setOpenSuggest(true)
            setSong("")
            // console.log(`https://www.youtube.com/watch?v=${i.id.videoId}&ab_channel=${i.snippet.channelTitle.split(' ')[0]}`)
        }else{
            items.length && setItems([])
        }
    }

    return (
        <div id="sideMenu" >
            <div>
                <img src={src} alt="avatar"/>
                <h2>{name}</h2>
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
            <Button variant="contained" color="secondary" onClick={leave}>
                Leave Room
            </Button>
            {items.length && openSuggest ?  <SuggestSong items={items} openSuggest={setOpenSuggest}/> : null}
        </div>
    )
}

export default inject("UserStore")(observer(SideMenu))
