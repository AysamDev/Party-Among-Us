import React, { useState } from 'react'
import {Button, TextField} from '@material-ui/core';
import Playlist from './Playlist'
import { observer, inject } from 'mobx-react'
import { useHistory } from "react-router-dom";

function SideMenu(props) {
    const {name, src} = props.UserStore.avatar
    const [song, setSong] = useState("")
    let history = useHistory()

    const suggest = async () => {//id, song, votes
        props.UserStore.suggestSong(Math.random()*10, song ,1)
    }

    const leave = async () => {
        props.UserStore.LeaveRoom()
        history.push("/home")
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
                onChange = {({target}) => setSong(target.value)}
            />
            <Button variant="contained" color="secondary" onClick={suggest}>
                Suggest Song
            </Button>
            <Button variant="contained" color="secondary" onClick={leave}>
                Leave Room
            </Button>
        </div>
    )
}

export default inject("UserStore")(observer(SideMenu))
