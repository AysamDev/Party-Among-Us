import React, { useRef, useEffect, useState } from 'react';
import BoardCanvas from './Board/BoardCanvas';
import { Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import InputEmoji from "react-input-emoji";
import { observer, inject } from 'mobx-react'
import { ADD_PLAYER, MOVE_PLAYER, PLAYER_MOVED, SEND_MESSAGE, RECEIVED_MESSAGE } from '../Constants';


const useStyles = makeStyles((theme) => ({
    selectTheme: {
        margin: theme.spacing(2),
        minWidth: 130,
        fontSize: 25
    },
    chat: {
        margin: theme.spacing(0.2),
        width: 1000,
        fontSize: 25,
        alignItems: 'center'
    },
    btnDance: {
        width: 120,
        margin: theme.spacing(1)
    }
}));

const Board = observer((props) => {

    const webSocket = useRef(props.UserStore.socket)

    let { userName, avatar, player_x, player_y, room, width, height } = props.UserStore

    const playerIndex = (socket_id) => {
        const index = boardRef.current.PLAYERS.findIndex(p => p.playerId === socket_id)
        return index
    }

    const canvasRef = useRef(null),
        messageRef = useRef(null),
        boardRef = useRef(null),
        [theme, setTheme] = useState(props.UserStore.room.theme),
        classes = useStyles();

    const doDance = () => {
        boardRef.current.PLAYERS[playerIndex(webSocket.current.id)].sendMessage('/dance');
        webSocket.current.emit(SEND_MESSAGE, {
            id: webSocket.current.id,
            message: '/dance',
            room: room._id
        })
    }

    const onSelectTheme = (e) => {
        const theTheme = e.target.value;
        boardRef.current.changeTheme(theTheme);
        setTheme(theTheme);
    }

    const sendMessage = () => {
        const message = messageRef.current;
        boardRef.current.PLAYERS[playerIndex(webSocket.current.id)].sendMessage(message.value);
        webSocket.current.emit(SEND_MESSAGE, {
            id: webSocket.current.id,
            message: message.value,
            room: room._id
        })
    }

    const onCanvasClick = (e) => {

        console.log(boardRef.current.PLAYERS);

        const rect = canvasRef.current.getBoundingClientRect();
        let x = Math.floor(e.clientX - rect.left);
        let y = Math.floor(e.clientY - rect.top);

        const playerId = webSocket.current.id;
        console.log(playerIndex(playerId))
        if (x + boardRef.current.PLAYERS[playerIndex(playerId)].width > canvasRef.current.width)
            x = x - boardRef.current.PLAYERS[playerIndex(playerId)].width;

        if (y + boardRef.current.PLAYERS[playerIndex(playerId)].height > canvasRef.current.height)
            y = y - boardRef.current.PLAYERS[playerIndex(playerId)].height;

        console.log(webSocket.current.id);
        webSocket.current.emit(MOVE_PLAYER, {
            id: webSocket.current.id,
            x: x,
            y: y,
            room: room._id
        })

        boardRef.current.PLAYERS[playerIndex(playerId)].targetPos = { x, y };
    }

    useEffect(() => {
        console.log('??????????????????????')
        //webSocket.current = props.UserStore.socket
        // const playerProps = {
        //     playerId: webSocket.current.id,
        //     userName: userName,
        //     avatar: avatar,
        //     width: width,
        //     height: height,
        //     x: player_x,
        //     y: player_y,
        //     playerMessage: playerMessage,
        //     theme: room.theme
        // }
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        boardRef.current = new BoardCanvas(canvas, context, theme);
        //boardRef.current.PLAYERS = []
        console.log(room.guests);
        room.guests.forEach(g => boardRef.current.newPlayer({
            playerId: g.id,
            userName: g.userName,
            avatar: g.avatar,
            x: 350,
            y: 350,
            width: 85,
            height: 85,
            theme: room.theme
        }));

        boardRef.current.start();

        webSocket.current.on(ADD_PLAYER, (data) => {
            console.log(data)
            boardRef.current.newPlayer({
                playerId: data.playerId,
                userName: data.userName,
                avatar: data.avatar,
                x: data.x,
                y: data.y,
                height: 85,
                width: 85,
                theme: data.theme
            });
        });

        webSocket.current.on(PLAYER_MOVED, (data) => {
            // e = ({clientX = x, clientY = y}, id = socket.id, bool = false)
            const { id, x, y } = data;
            console.log(playerIndex(id));
            //onCanvasClick({clientX: x, clientY: y}/*, id, true*/)
            boardRef.current.PLAYERS[playerIndex(id)].targetPos = { x, y };
        });

        webSocket.current.on(RECEIVED_MESSAGE, (data) => {
            const { message, id } = data
            //playerMessage = message
            console.log(message);
            boardRef.current.PLAYERS[playerIndex(id)].sendMessage(message);
        });
    }, []);



    return (
        <div id="board">
            <canvas onMouseDown={onCanvasClick} ref={canvasRef} width="1000" height="632"></canvas>
            <br />
            <FormControl className={classes.chat}>
                <InputEmoji maxLength={31} ref={messageRef} onEnter={sendMessage} cleanOnEnter placeholder="Type a message (/dance to dance)" />
                <Button type="button" onClick={doDance} className={classes.btnDance} variant="contained" color="secondary">Dance</Button>
            </FormControl>
            <br />
            <FormControl className={classes.selectTheme}>
                <InputLabel color="secondary">Select a theme:</InputLabel>
                <NativeSelect value={theme} onChange={onSelectTheme} name="select_theme" color="secondary">
                    <option value="theme1">Icy</option>
                    <option value="theme2">Sky</option>
                    <option value="theme3">Thunder</option>
                    <option value="theme4">Halloween1</option>
                    <option value="theme5">Halloween2</option>
                    <option value="theme6">WildZone</option>
                    <option value="theme7">Medieval</option>
                    <option value="theme8">Disco</option>
                    <option value="theme9">DiscoStar</option>
                    <option value="theme10">PlantWorld</option>
                    <option value="theme11">DJ.Penguin</option>
                    <option value="theme12">Splash</option>
                    <option value="theme13">Astro</option>
                    <option value="theme14">Snowy</option>
                </NativeSelect>
            </FormControl>
        </div>
    )
})

export default inject("UserStore")(Board)

