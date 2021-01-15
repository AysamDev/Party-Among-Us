import React from 'react'
import Button from '@material-ui/core/Button';
import Playlist from './Playlist'

function SideMenu() {
    return (
        <div id="sideMenu" >
            <div>a div about user name and avatar</div>
            <Playlist />
            <Button variant="contained" color="secondary">
                Suggest Song
            </Button>
            <Button variant="contained" color="secondary">
                Leave Room
            </Button>
        </div>
    )
}

export default SideMenu
