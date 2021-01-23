import React, {useState} from 'react';
import RoomResult from './RoomResult';
import { observer, inject } from 'mobx-react';
import { TextField } from '@material-ui/core';

//textfield: at the beginning there is top 10
function Home(props) {
    const [searchInput, setSearchInput] = useState(""),
    heading = searchInput.length ? "Search Results" :"Top 10";

    const dynamicSearch = () => {
        return props.UserStore.rooms.filter(r => r.roomName.toLowerCase().includes(searchInput.toLowerCase()));
    }

    const rooms = searchInput.length ?  dynamicSearch() : props.UserStore.getTop10();

    return (
        <div id="home">
            <div id="landingActions">
                <div id="userActions">
                    <TextField id="search" label="Find Room" value={searchInput}
                    onChange={({target})=> setSearchInput(target.value)} />
                </div>
                <h2>{heading}</h2>
                <div id="top10">
                    {rooms.map(r => <RoomResult room={r} key={r._id} id={r._id} />)}
                </div>
            </div>
        </div>
    )
}

export default inject("UserStore")(observer(Home));