import React, {useState} from 'react'
import Board from './Board'
import SideMenu from './SideMenu'
import UserForm from './UserForm'

function Room() {
    const [open, setOpen] = useState(true)
    return (
        <div className="roomGrid">
            {open ? <UserForm open={setOpen} /> : (
                <>
                    <SideMenu />
                    <Board /> 
                </>
            )}
            
        </div>
    )
}

export default Room
