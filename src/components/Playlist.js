import React from 'react';
import { observer, inject } from 'mobx-react';
import Song from './Song';

function Playlist(props) {
    return (
        <div>
            {props.UserStore.room.queue.map(q => <Song song={q} key={q.id}/>)}
        </div>
    )
}

export default inject("UserStore")(observer(Playlist));
