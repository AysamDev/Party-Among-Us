import React, { Component } from 'react';
import YouTube from 'react-youtube';
import {
  PLAY, PAUSE, SYNC_TIME, NEW_VIDEO, ASK_FOR_VIDEO_INFORMATION,
  SYNC_VIDEO_INFORMATION, JOIN_ROOM
} from '../Constants';

var io = require('socket.io-client');
const socketUrl = "http://localhost:4200";

const opts = {
  height: '390',
  width: '640',
  playerVars: {
    controls: 2, //change to zero if we decide to remove control
  }
}

class Video extends Component {

  state = {
    socket: null,
    player: null,
    room: '',
    currentVidId: 'ql0PwD56JFY',
    nextVidId: 'Je-Tori3psE'
  }

  onSocketMethods = (socket) => {
    socket.on('connect', () => {
      socket.emit(JOIN_ROOM, {
        room: this.state.room,
      });
      socket.emit(ASK_FOR_VIDEO_INFORMATION);
    });

    socket.on('disconnect', () => {
      console.log("Disconnected");
    });

    socket.on(PLAY, () => {
      this.state.player.playVideo();
    });

    socket.on(PAUSE, () => {
      this.state.player.pauseVideo();
    });

    socket.on(SYNC_TIME, (currentTime) => {
      this.syncTime(currentTime);
    })

    socket.on(NEW_VIDEO, () => {
      this.state.player.loadVideoById({
        videoId: this.state.nextVidId
      });
      this.setState({
        nextVidId: '7pOEdPQ5n4w' //should be id of next song from state
      });
    });

    socket.on(ASK_FOR_VIDEO_INFORMATION, () => {
      const data = {
        url: this.state.player.getVideoUrl(),
        currentTime: this.state.player.getCurrentTime()
      }
      socket.emit(SYNC_VIDEO_INFORMATION, data);
    });

    socket.on(SYNC_VIDEO_INFORMATION, (data) => {
      const videoId = this.state.currentVidId
      this.state.player.loadVideoById({
        videoId: videoId,
        startSeconds: data.currentTime
      });
    });
  }

  syncTime = (currentTime) => {
    if (this.state.player.getCurrentTime() < currentTime - 0.5 || this.state.player.getCurrentTime() > currentTime + 0.5) {
      this.state.player.seekTo(currentTime);
      this.state.player.playVideo();
    }
  }

  onReady = (e) => {
    this.setState({
      player: e.target
    });

    const socket = io(socketUrl);
    this.setState({ socket });
    this.onSocketMethods(socket);
  }

  onStateChanged = (e) => {
    switch (this.state.player.getPlayerState()) {
      case -1:
        this.state.socket.emit(PLAY);
        break;
      case 0: //song endded - play next in Q
        this.state.socket.emit(NEW_VIDEO, this.state.nextVidId);
        break;
      case 1:
        this.state.socket.emit(SYNC_TIME, this.state.player.getCurrentTime());
        this.state.socket.emit(PLAY);
        break;
      case 2:
        this.state.socket.emit(PAUSE);
        break;
      case 3:
        this.state.socket.emit(SYNC_TIME, this.state.player.getCurrentTime());
        break;
      case 5:
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <div>
        <div className="responsive-video">
          <YouTube
            videoId={this.state.currentVidId}
            opts={opts}
            onReady={this.onReady}
            onStateChange={this.onStateChanged}
            autoPlay
          />
        </div>
      </div>
    )
  }
}

export default Video