import React, {useState, useEffect} from 'react'
import Board from './Board'
import SideMenu from './SideMenu'
import UserForm from './UserForm'
import {useHistory, useLocation} from "react-router-dom";
import { observer, inject } from 'mobx-react'
import {Button} from '@material-ui/core';

function Room(props) {
    const [open, setOpen] = useState(null)
    const location = useLocation()
    let history = useHistory()
    
    useEffect(() => {
        checkValidity()
    }, [])

    const checkValidity = async () => {
        const roomID = location.pathname.split('/')[2]
        await props.UserStore.getRooms()
        const room = props.UserStore.rooms.find(r => r._id === roomID)
        if(room && room.guests.length < room.size){
            if(room.roomPassword){
                const password = prompt("Please write the room Password")
                if(password === room.roomPassword){
                    props.UserStore.setRoom(room)
                    setOpen(true)
                }
            }else{
                props.UserStore.setRoom(room)
                setOpen(true)
            }
        }else if(!room){
            alert("Room is Not Found")
            history.push("/home")
        }else{
            alert("The Room is Full")
            history.push("/home")
        }
    }

    const checkHost = () => props.UserStore.socket.id === props.UserStore.room.host

    const deleteRoom = async () => {
        props.UserStore.deleteRoom()
        history.push("/home")
    }

    return (
        <div className="roomGrid">
            {open && <UserForm open={setOpen} /> }
            {open === false && (
                <>
                    <SideMenu />
                    <Board /> 
                    {checkHost() && <Button variant="contained" color="secondary" onClick={deleteRoom} >
                        Delete Room
                    </Button>}
                </>
            )}
        </div>
    )
}

export default inject("UserStore")(observer(Room))

