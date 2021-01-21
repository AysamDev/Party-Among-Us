import React, { useRef, useEffect, useState } from 'react';
import BoardCanvas from './Board/BoardCanvas';
import { Button } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import InputEmoji from "react-input-emoji";
import { observer, inject } from 'mobx-react';


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

function Board(props) {
    const canvasRef = useRef(null),
    messageRef = useRef(null),
    boardRef = useRef(null),
    [theme, setTheme] = useState(props.UserStore.room.theme),
    classes = useStyles();

    const doDance = () => {
        boardRef.current.PLAYERS[0].movePlayer(null);
    }

    const onSelectTheme = (e) => {
        const theTheme = e.target.value;
        boardRef.current.changeTheme(theTheme);
        setTheme(theTheme);
    }

    const sendMessage = () => {
        const message = messageRef.current;
        boardRef.current.PLAYERS[0].sendMessage(message.value);
    }

    const onCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        let x = Math.floor(e.clientX - rect.left);
        let y = Math.floor(e.clientY - rect.top);

        if (x + boardRef.current.PLAYERS[0].width > canvasRef.current.width)
            x = x - boardRef.current.PLAYERS[0].width;

        if (y + boardRef.current.PLAYERS[0].height > canvasRef.current.height)
            y = y - boardRef.current.PLAYERS[0].height;

        boardRef.current.PLAYERS[0].targetPos = {x, y};
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        boardRef.current = new BoardCanvas(canvas, context, theme);
        //TODO get sockets for other players before we start
        boardRef.current.start();
    }, []);

    return (
        <div id="board">
            <canvas onMouseDown={onCanvasClick} ref={canvasRef} width="1000" height="632"></canvas>
            <br/>
            <FormControl className={classes.chat}>
                <InputEmoji maxLength={31} ref={messageRef} onEnter={sendMessage} cleanOnEnter placeholder="Type a message (/dance to dance)" />
                <Button type="button" onClick={doDance} className={classes.btnDance} variant="contained" color="secondary">Dance</Button>
            </FormControl>
            <br/>
            <FormControl className={classes.selectTheme}>
                <InputLabel color="secondary">Select a theme:</InputLabel>
                <NativeSelect value={theme} onChange={onSelectTheme} name="select_theme" color="secondary">
                    <option value="theme1.jpg">Icy</option>
                    <option value="theme2.jpg">Sky</option>
                    <option value="theme3.jpg">Thunder</option>
                    <option value="theme4.jpg">Halloween1</option>
                    <option value="theme5.jpg">Halloween2</option>
                    <option value="theme6.jpg">WildZone</option>
                    <option value="theme7.jpg">Medieval</option>
                    <option value="theme8.jpg">Disco</option>
                    <option value="theme9.jpg">DiscoStar</option>
                    <option value="theme10.jpg">PlantWorld</option>
                    <option value="theme11.jpg">DJ.Penguin</option>
                    <option value="theme12.jpg">Splash</option>
                    <option value="theme13.jpg">Astro</option>
                    <option value="theme14.jpg">Snowy</option>
                </NativeSelect>
            </FormControl>
        </div>
    )
}

export default inject("UserStore")(observer(Board))
