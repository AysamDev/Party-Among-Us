import React, { useRef } from 'react';
import YouTube from 'react-youtube';
import {
  PLAY, PAUSE, SYNC_TIME, NEW_VIDEO, ASK_FOR_VIDEO_INFORMATION,
  SYNC_VIDEO_INFORMATION
} from '../Constants';
import { observer, inject } from 'mobx-react'

const Video = observer((props) => {

  const webSocket = useRef(props.UserStore.socket)
  let { room, currVidId, vidPlayer, currentVidTime, removeSong, nextVidId } = props.UserStore

  //console.log(room.queue)

  const opts = {
    height: '220',
    width: '440',
    playerVars: {
      controls: 2, //change to zero if we decide to remove control
      autoplay: 1,
      start: currentVidTime
    }
  }

  const onReady = (e) => {
    vidPlayer = e.target
    onSocketMethods();
  }

  const onSocketMethods = () => {

    webSocket.current.on(PLAY, () => {
      vidPlayer.playVideo();
    });

    webSocket.current.on(PAUSE, () => {
      vidPlayer.pauseVideo();
    });

    webSocket.current.on(SYNC_TIME, (data) => {
      syncTime(data.currentTime);
    })

    webSocket.current.on(NEW_VIDEO, (data) => {
      vidPlayer.loadVideoById({
        videoId: data.vidId
      });
    });

    webSocket.current.on(ASK_FOR_VIDEO_INFORMATION, () => {
      const data = {
        vidId: currVidId,
        currentTime: vidPlayer.getCurrentTime(),
        room: room._id
      }
      webSocket.current.emit(SYNC_VIDEO_INFORMATION, data);
    });

    webSocket.current.on(SYNC_VIDEO_INFORMATION, (data) => {
      vidPlayer.loadVideoById({
        videoId: data.vidId,
        startSeconds: data.currentTime,
        room: room._id
      });
    });

  }

  const syncTime = (currentTime) => {
    if (vidPlayer.getCurrentTime() < currentTime - 0.5 || vidPlayer.getCurrentTime() > currentTime + 0.5) {
      vidPlayer.seekTo(currentTime);
      vidPlayer.playVideo();
      console.log(currentTime)
    }
  }


  const onStateChanged = (e) => {

    switch (vidPlayer.getPlayerState()) {
      case -1:
        webSocket.current.emit(PLAY, { room: room._id });
        break;
      case 0:
        if (room.queue[1]) {
          nextVidId = room.queue[1].id
          webSocket.current.emit(NEW_VIDEO, { vidId: nextVidId, room: room._id });
          console.log(room.queue)
          removeSong(currVidId)
          console.log('song removed???????????')
          console.log(room.queue)
          currVidId = nextVidId
        } else {
          room.queue[0] = false
        }
        break;
      case 1:
        webSocket.current.emit(SYNC_TIME, { currentTime: vidPlayer.getCurrentTime(), room: room._id });
        webSocket.current.emit(PLAY, { room: room._id });
        break;
      case 2:
        webSocket.current.emit(PAUSE, { room: room._id });
        break;
      case 3:
        webSocket.current.emit(SYNC_TIME, { currentTime: vidPlayer.getCurrentTime(), room: room._id });
        break;
      case 5:
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <div className="responsive-video">
        <YouTube
          videoId={currVidId}
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChanged}
          autoPlay
        />
      </div>
    </div>
  );
});

export default inject("UserStore")(Video);