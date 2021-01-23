import React from 'react';
import { observer, inject } from 'mobx-react';
import Song from './Song';

function Playlist(props) {
    return (
        <div>
            {props.UserStore.room.queue ? props.UserStore.sortQueue.map((q, i) => <Song song={q} key={i} />) : null}
        </div>
    )
}

export default inject("UserStore")(observer(Playlist));