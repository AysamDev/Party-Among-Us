import React, { useRef, useEffect, useState } from 'react';
import BoardCanvas from './Board/BoardCanvas';
import { Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import InputEmoji from "react-input-emoji";
import { observer, inject } from 'mobx-react';
import Alert from './Alert';
import { ADD_PLAYER, MOVE_PLAYER, PLAYER_MOVED, SEND_MESSAGE, RECEIVED_MESSAGE, REMOVE_PLAYER, NEW_PLAYER_HOST } from '../Constants';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
    selectTheme: {
        margin: theme.spacing(2),
        minWidth: 150
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
    const SOUNDS = {
        "disconnect": new Audio('./sounds/disconnect.wav'),
        "vote": new Audio('./sounds/vote.wav')
    };
    const canvasRef = useRef(null),
    messageRef = useRef(null),
    boardRef = useRef(null),
    [theme, setTheme] = useState(props.UserStore.room.theme),
    classes = useStyles(),
    webSocket = useRef(props.UserStore.socket),
    themeOptions = props.UserStore.themes.map(t => ({ label: t.name, value: t.value })),
    [alert, setAlert] = useState({value: false, text: ""}),
    CONNECTION_ERROR = "Connection Error!";
    let { room, userName, avatar} = props.UserStore;
    const { enqueueSnackbar } = useSnackbar()

    const playerIndex = (socket_id) => {
        const index = boardRef.current.PLAYERS.findIndex(p => p.playerId === socket_id);
        return index;
    }

    const doDance = () => {
        if (playerIndex(webSocket.current.id) !== -1) {
            boardRef.current.PLAYERS[playerIndex(webSocket.current.id)].sendMessage('/dance');
            webSocket.current.emit(SEND_MESSAGE, {
                id: webSocket.current.id,
                message: '/dance',
                room: room._id
            });
        }
        else {
            //todo remove player from room
            setAlert({value: true, text: CONNECTION_ERROR});
        }
    }

    const onSelectTheme = (e) => {
        const theTheme = e.value;
        boardRef.current.changeTheme(theTheme);
        setTheme(theTheme);
    }

    const sendMessage = () => {
        const message = messageRef.current;
        if (playerIndex(webSocket.current.id) !== -1) {
            boardRef.current.PLAYERS[playerIndex(webSocket.current.id)].sendMessage(message.value);
            webSocket.current.emit(SEND_MESSAGE, {
                id: webSocket.current.id,
                message: message.value,
                room: room._id
            });
        }
        else {
            //todo remove player from room
            setAlert({value: true, text: CONNECTION_ERROR});
        }
    }

    const onCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        let x = Math.floor(e.clientX - rect.left);
        let y = Math.floor(e.clientY - rect.top);

        const playerId = webSocket.current.id;

        if (playerIndex(playerId) !== -1) {
            if (x + boardRef.current.PLAYERS[playerIndex(playerId)].width > canvasRef.current.width)
                x = x - boardRef.current.PLAYERS[playerIndex(playerId)].width;

            if (y + boardRef.current.PLAYERS[playerIndex(playerId)].height > canvasRef.current.height)
                y = y - boardRef.current.PLAYERS[playerIndex(playerId)].height;

            webSocket.current.emit(MOVE_PLAYER, {
                id: webSocket.current.id,
                x: x,
                y: y,
                room: room._id
            });

            boardRef.current.PLAYERS[playerIndex(playerId)].targetPos = { x, y };
        }
        else {
            //todo remove player from room
            setAlert({value: true, text: CONNECTION_ERROR});
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        boardRef.current = new BoardCanvas(canvas, context, theme);

        if(webSocket.current.id === room.host){
            room.guests.forEach(g => boardRef.current.newPlayer({
                playerId: g.id,
                userName: g.userName,
                avatar: g.avatar,
                x: props.UserStore.player_x,
                y: props.UserStore.player_y,
                width: 85,
                height: 85,
                theme: room.theme
            }));
        }else{
            webSocket.current.on(NEW_PLAYER_HOST, (data) => {
                data.forEach(d => boardRef.current.newPlayer({
                    width: d.width,
                    height: d.height,
                    playerId: d.playerId,
                    userName: d.userName,
                    avatar: d.avatar,
                    theme: d.theme,
                    x: d.x,
                    y: d.y,
                }, { x: data.x, y: data.y}))
            })
        }

        // room.guests.forEach(g => boardRef.current.newPlayer({
        //     playerId: g.id,
        //     userName: g.userName,
        //     avatar: g.avatar,
        //     x: 350,
        //     y: 350,
        //     width: 85,
        //     height: 85,
        //     theme: room.theme
        // }));

        boardRef.current.start();

        webSocket.current.on(ADD_PLAYER, (data) => {
            enqueueSnackbar(`${data.userName} has joined`, { variant: 'success' });
            boardRef.current.newPlayer({
                playerId: data.playerId,
                userName: data.userName,
                avatar: data.avatar,
                x: data.x,
                y: data.y,
                theme: data.theme
            });
            if(webSocket.current.id === room.host){
                webSocket.current.emit(NEW_PLAYER_HOST, {players: boardRef.current.PLAYERS, socket: data.playerId})
            }
        });

        webSocket.current.on(PLAYER_MOVED, (data) => {
            const { id, x, y } = data;
            boardRef.current.PLAYERS[playerIndex(id)].targetPos = { x, y };
        });

        webSocket.current.on(RECEIVED_MESSAGE, (data) => {
            const { message, id } = data;
            boardRef.current.PLAYERS[playerIndex(id)].sendMessage(message);
        });

        webSocket.current.on(REMOVE_PLAYER, (data) => {
            const index = playerIndex(data);
            const userName = boardRef.current.PLAYERS[index].userName
            SOUNDS.disconnect.play();
            boardRef.current.PLAYERS.splice(index, 1);
            enqueueSnackbar(`${userName} has Left The Room`, { variant: 'warning' });
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
                <Select options={themeOptions} placeholder="Select a theme:" onChange={onSelectTheme} name="select_theme" color="secondary" />
            </FormControl>
            {alert.value && <Alert text={alert.text} />}
        </div>
    )
})

export default inject("UserStore")(Board);