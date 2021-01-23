import React, {useState, useEffect} from 'react';
import Board from './Board';
import SideMenu from './SideMenu';
import UserForm from './UserForm';
import {useHistory, useLocation} from "react-router-dom";
import { observer, inject } from 'mobx-react';
import {Button} from '@material-ui/core';
import Alert from './Alert';
import Prompt from './Prompt';

function Room(props) {
    const [open, setOpen] = useState(null),
    location = useLocation(),
    [alert, setAlert] = useState({value: false, text: ""}),
    [prompt, setPrompt] = useState(false),
    checkHost = () => props.UserStore.socket.id === props.UserStore.room.host;
    let history = useHistory();

    useEffect(() => {checkValidity()}, []);

    const checkValidity = async () => {
        const roomID = location.pathname.split('/')[2];
        await props.UserStore.getRooms();
        const room = props.UserStore.rooms.find(r => r._id === roomID);

        if(room && room.guests.length < room.size) {
            if (room.roomPassword)
                setPrompt(true);
            else {
                props.UserStore.setRoom(room);
                setOpen(true);
            }
        }
        else if (!room)
            setAlert({value: true, text: "The room is not found!"});
        else
            setAlert({value: true, text: "The room is full!"});
    }

    const deleteRoom = async () => {
        props.UserStore.deleteRoom();
        history.push("/");
    }

    return (
        <div id="room">
            {open && <UserForm open={setOpen} /> }
            {alert.value && <Alert text={alert.text} />}
            {prompt && <Prompt setOpen={setOpen} />}
            {open === false && (
                <>
                <div className="roomGrid">
                    <SideMenu />
                    <Board />
                    {checkHost() && <Button variant="contained" color="secondary" onClick={deleteRoom} >
                        Delete Room
                    </Button>}
                </div>
                </>
            )}
        </div>
    )
}

export default inject("UserStore")(observer(Room));