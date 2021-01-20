import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import RoomResult from './RoomResult';
import CreateRoom from './CreateRoom';
import { observer, inject } from 'mobx-react';
import { TextField } from '@material-ui/core';

//textfield: at the beginning there is top 10
function Home(props) {

    const [searchInput, setSearchInput] = useState("")
    const [popUp, setPopUp] = useState(false)

    const dynamicSearch = () => {
        return props.UserStore.rooms.filter(r => r.roomName.toLowerCase().includes(searchInput.toLowerCase()) )
    }

    const popForm = () => {
        const currPop = popUp ? false : true
        setPopUp(currPop)
    }

    const rooms = searchInput.length ?  dynamicSearch() : props.UserStore.getTop10()
    const heading = searchInput.length ? "Search Results" :"Top 10"

    return (
        <div id="home">
            <div id="landingActions">
                <div id="userActions">
                    <TextField id="search" label="Find Room" value={searchInput}
                    onChange={({target})=> setSearchInput(target.value)} />
                    <Button variant="contained" color="secondary" id="createRoom" onClick={popForm}>
                        Create Room
                    </Button>
                </div>
                <h2>{heading}</h2>
                <div id="top10">
                    {rooms.map(r => <RoomResult room={r} key={r._id} id={r._id} />)}
                </div>
            </div>
            {popUp && <CreateRoom open={setPopUp} />}
        </div>
    )
}

export default inject("UserStore")(observer(Home))
