import React, {useState} from 'react';
import { observer, inject } from 'mobx-react';
import { useHistory , useLocation } from "react-router-dom";
import {Button} from '@material-ui/core';
import CreateRoom from './CreateRoom';

function Header(props) {
    const history = useHistory(),
    location = useLocation(),
    [popUp, setPopUp] = useState(false);

    const leave = async () => {
        const room = location.pathname.split('/')[1];

        if(room === 'room'){
            props.UserStore.LeaveRoom();
            history.push("/");
        }
    }

    const popForm = () => {
        const currPop = popUp ? false : true;
        setPopUp(currPop);
    }

    return (
        <div id="header">
            <div>Logo</div>
            {location.pathname.includes('/room/') ?
                <Button variant="contained" color="secondary" onClick={leave}>
                    Leave Room
                </Button>
                :
                <Button variant="contained" color="secondary" id="createRoom" onClick={popForm}>
                    Create Room
                </Button>
            }
            {popUp && <CreateRoom open={setPopUp} />}
		</div>
    )
}

export default inject("UserStore")(observer(Header));