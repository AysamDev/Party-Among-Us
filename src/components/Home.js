import React from 'react'
import Button from '@material-ui/core/Button';
import Top10 from './Top10'
import SearchRoom from './SearchRoom'

function Home() {
    return (
        <div id="home">
            <div id="userInfo">
                <input type="text" placeholder="userName" />
                <select name="avatars" id="avatars">
                    <option value="1">avatar 1</option>
                    <option value="2">avatar 2</option>
                </select>
            </div>
            <div id="landingActions">
                <SearchRoom />
                <Button variant="contained" color="secondary" id="createRoom">
                    Create Room
                </Button>
                <Top10 />
            </div>            
        </div>
    )
}

export default Home
