import React from 'react'
import { useHistory } from "react-router-dom";
import { observer, inject } from 'mobx-react'

function RoomResult(props) {
    const { roomName, theme, guests, size, description, tags } = props.room
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
        </div>
    )
}

export default inject("UserStore")(observer(RoomResult))
