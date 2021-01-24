import React, { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { PLAY, PAUSE, SYNC_TIME, NEW_VIDEO, ASK_FOR_VIDEO_INFORMATION, BLAHBLAH, SYNC_VIDEO_INFORMATION } from '../Constants';
import { observer, inject } from 'mobx-react';

const Video = observer((props) => {
	const webSocket = useRef(props.UserStore.socket)
	let { room, currVidId, vidPlayer, removeSong /*changeVidPlayer, /* nextVidId, sortQueue*/ } = props.UserStore;
	// let currentVidTime = 0
	//var vidPlayer

	// const [open, setOpen] = useState(webSocket.current.id === room.host ? true : false)
	// const [currTime, setCurrtime] = useState(0)

	const opts = {
		height: '220',
		width: '440',
		playerVars: {
			controls: 2, //change to zero if we decide to remove control
			autoplay: 1,
			//start: currentVidTime //80//currentVidTime
		}
	}

	const onReady = async (e) => {
		//changeVidPlayer(e.target)
		//await props.UserStore.changeVidPlayer(e.target)
		vidPlayer = e.target
		onSocketMethods();
	}

	// useEffect(() => {
	// 	onSocketMethods();
	// 	// setOpen(true)
	// 	// if (webSocket.current.id === room.host) {

	// 	// }
	// }, [])

	const onSocketMethods = () => {

		//let currentVidTime = 0

		webSocket.current.on(PLAY, (data) => {
			//console.log('....')
			syncTime(data.currentTime);
			//vidPlayer.seekTo(data.currentTime, false)
			vidPlayer.playVideo();   // currentTime: vidPlayer.getCurrentTime(),
		});

		webSocket.current.on(PAUSE, () => {
			vidPlayer.pauseVideo();
		});

		webSocket.current.on(SYNC_TIME, (data) => {
			console.log(data.currentTime)
			if (webSocket.current.id === room.host) {
				syncTime(data.currentTime);
			}
		})

		webSocket.current.on(NEW_VIDEO, (data) => {
			vidPlayer.loadVideoById({ videoId: data.vidId });
		});

		webSocket.current.on(SYNC_VIDEO_INFORMATION, (data) => {
			console.log('SYNC_VIDEO_INFORMATION')
			//setOpen(true)
			console.log('SYNC_VIDEO_INFORMATION')
			vidPlayer.loadVideoById({
				videoId: data.videoId,
				startSeconds: data.currentTime,
			});
		});

		webSocket.current.on(ASK_FOR_VIDEO_INFORMATION, (socketID) => {
			//consol.log('ONASK_FOR_VIDEO_INFORMATION')
			if (webSocket.current.id !== room.host) {
				//currentVidTime = (vidPlayer.getCurrentTime())
				// console.log('socketID')
				// console.log(socketID)
				// console.log(room.host)
				webSocket.current.emit(SYNC_VIDEO_INFORMATION, { currentTime: vidPlayer.getCurrentTime(), socket: socketID, videoId: currVidId });
				console.log('ASKFORVIDINFO')
				// console.log(vidPlayer.getCurrentTime())
			}
		})


	}

	const syncTime = (currentTime) => {
		// if (webSocket.current.id !== room.host) {
			if (vidPlayer.getCurrentTime() < currentTime - 0.5 || vidPlayer.getCurrentTime() > currentTime + 0.5) {
				vidPlayer.seekTo(currentTime);
				vidPlayer.playVideo();
				//console.log(currentTime)
			}
		// }
	}

	const onStateChanged = (e) => {
		switch (vidPlayer.getPlayerState()) {
			case -1:
				console.log('-1')
				webSocket.current.emit(PLAY, { currentTime: vidPlayer.getCurrentTime(), room: room._id }); // 
				break;
			case 0:
				// if (webSocket.current.id === room.host) {
				// 	webSocket.current.emit(NEW_PLAYER_HOST, { vidId: 'pjxU-vSPNXE', socket: room: room._id })
				// }
				// if (room.queue) {
				// 	if (room.queue[]) {
				// 		const nextVidId = sortQueue[1].id
				// console.log("?????????????")
				webSocket.current.emit(NEW_VIDEO, { vidId: 'pjxU-vSPNXE', room: room._id });
				// removeSong(currVidId)
				//sortQueue.splice(0, 1)
				// console.log('song removed???????????')
				// console.log(sortQueue)
				// currVidId = sortQueue[0].id
				// 	} else {
				// 		props.UserStore.room.queue = null
				// 	}
				// }
				// } else {
				// 	// console.log('else')
				// 	// sortQueue[0] = null
				// }
				break;
			case 1:
				console.log('1')
				webSocket.current.emit(SYNC_TIME, { currentTime: vidPlayer.getCurrentTime(), room: room._id });
				webSocket.current.emit(PLAY, { room: room._id });
				break;
			case 2:
				console.log('2')
				webSocket.current.emit(PAUSE, { room: room._id });
				break;
			case 3:
				console.log('3')
				webSocket.current.emit(SYNC_TIME, { currentTime: vidPlayer.getCurrentTime(), room: room._id });
				break;
			case 5:
				console.log('5')
				break;
			default:
				break;
		}
	}

	return (
		<div>
			{console.log(room.queue)}
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