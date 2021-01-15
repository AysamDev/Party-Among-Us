import React from 'react'
import Board from './Board'
import SideMenu from './SideMenu'

function Room() {
    return (
        <div class="roomGrid">
            <SideMenu />
            <Board /> 
        </div>
    )
}

export default Room
