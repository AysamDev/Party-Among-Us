import React from 'react';
import { useHistory } from "react-router-dom";
import { observer, inject } from 'mobx-react';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';


function RoomResult(props) {
    const { roomPassword, roomName, theme, guests, size, description, tags } = props.room
    let history = useHistory()

    const openRoom = () => {
        props.UserStore.getRoom(props.id)
        history.push(`/room/${props.id}`)
    }

    return (
        <div className="roomResult" onClick={openRoom} >
            <img src={theme} alt="theme"/>
            <h3>{roomName}</h3>
            {tags.map((t, i)=> <span className="tag" key={i}>{t} </span>)}
            <p>{description}</p>
            <p>{guests.length}/{size}</p>
            {roomPassword && <LockTwoToneIcon /> }
        </div>
    )
}

export default inject("UserStore")(observer(RoomResult))
