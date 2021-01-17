import React from 'react'
import { observer, inject } from 'mobx-react'

function Song(props) {
    const {id, votes, song} = props.song
    
    const like = async () => {
        props.UserStore.addLike(id)
    }

    return (
        <div>
            <h3>{song} <span>{votes}</span> <button onClick={like}>Like</button></h3>
        </div>
    )
}

export default inject("UserStore")(observer(Song))
