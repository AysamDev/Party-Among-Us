import React, { useState } from 'react';
import { observer, inject } from 'mobx-react';
import { TextField, Button, Modal, Backdrop, Fade, makeStyles } from '@material-ui/core';
import Select from 'react-select';
import { useSnackbar } from 'notistack';
import AvatarOption from './AvatarOption'
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 2),
        display: 'grid',
        gridGap: theme.spacing(1)
    },
    grid: {
        textAlign: 'center'
    }
}));

function CreateRoom(props) {
    const [roomName, setRoomName] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [theme, setTheme] = useState("");
    const [userName, setUserName] = useState("")
    const [avatar, setAvatar] = useState("")
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const classes = useStyles();

    const {genres, themes } = props.UserStore
    const tagOptions = genres.map((g, i) => ({ label: g, value: i }))
    const themeOptions = themes.map(t => ({ label: t.name, value: t.value }))

    const handleClose = () => {
        props.open(false)
    };

    const updateSelect = (event) => {
        setTags(event ? event : [])
    }

    const createRoom = async () => {
        if (!roomName || !theme || !userName || !avatar ) {
            enqueueSnackbar('Missing Fields', { variant: 'error' })
        } else {
            console.log(avatar)
            await props.UserStore.createRoom(roomName, roomPassword, description, tags.map(t => t.label), theme, userName, avatar)
            history.push(`/room/${props.UserStore.room._id}/host`)
            handleClose()
        }
    }

    return (
        <div id="createRoomPopUp" >
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={true}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={true}>
                    <div className={classes.paper} >
                        <TextField
                            placeholder="Room Name"
                            label="Room Name"
                            value={roomName}
                            variant="outlined"
                            id="roomName"
                            onChange={({ target }) => setRoomName(target.value)}
                        />
                        <TextField
                            id="roomPassword"
                            placeholder="Password (optional)"
                            label="Password (for Private Room)"
                            type="password"
                            variant="outlined"
                            value={roomPassword}
                            onChange={({ target }) => setRoomPassword(target.value)}
                        />
                        <TextField
                            placeholder="Description"
                            label="Description"
                            value={description}
                            variant="outlined"
                            id="description"
                            onChange={({ target }) => setDescription(target.value)}
                        />
                        <Select
                            isMulti
                            name="tags"
                            options={tagOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select Tags"
                            onChange={updateSelect}
                        />
                        <Select
                            options={themeOptions}
                            onChange={event => setTheme(event ? event.value : "")}
                            placeholder="Select Theme"
                            isClearable="true" id="themeSelect"
                        />
                        <TextField
                            placeholder="Nickname & Avatar"
                            color="secondary"
                            value={userName}
                            variant="outlined"
                            id="userName"
                            onChange={({ target }) => setUserName(target.value)}
                        />
                        <br />
                        <div id="avatarsImg" >
                            {props.UserStore.avatars.map(a => <AvatarOption key={a.name} avatar={a} setAvatar={setAvatar} create="create" />)}
                        </div>
                        <Button variant="contained" color="secondary" onClick={createRoom} >
                            Create Room
                        </Button>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default inject("UserStore")(observer(CreateRoom))
