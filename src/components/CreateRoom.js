import React, {useState} from 'react';
import { observer, inject } from 'mobx-react';
import {TextField, Button, Modal, Backdrop, Fade, makeStyles} from '@material-ui/core';
import Select from 'react-select';
import { useSnackbar } from 'notistack';

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
        padding: theme.spacing(4, 4, 4),
        display: 'grid',
        gridGap: theme.spacing(2)
    }
}));

function CreateRoom(props) {
    const [roomName, setRoomName] = useState("");
    const [roomPassword, setRoomPassword] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [theme, setTheme] = useState("");
    const { enqueueSnackbar } = useSnackbar();

    const classes = useStyles();

    const tagOptions = props.UserStore.genres.map((g, i)=> ({label: g, value: i}))
    const themeOptions = props.UserStore.images.map(i => ({label: i.id, value: i.src}))

    const handleClose = () => {
        props.open(false)
    };

    const updateSelect = (event) => {
        setTags(event ? event : [])
    }

    const createRoom = () => {
        if(!roomName || !theme){
            enqueueSnackbar('some fields are missing', { variant: 'warning' })
        }else{
            props.UserStore.createRoom(roomName, roomPassword, description, tags.map(t=> t.label), theme)
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
                        required label="Room Name"
                        value={roomName}
                        variant="outlined"
                        id="roomName"
                        onChange = {({target}) => setRoomName(target.value)}
                    />
                    <TextField
                        id="roomPassword"
                        label="Password if Room Private"
                        type="password"
                        variant="outlined"
                        value={roomPassword}
                        onChange={({target}) => setRoomPassword(target.value)}
                    />
                    <TextField
                        required label="Description"
                        value={description}
                        variant="outlined"
                        id="description"
                        onChange = {({target}) => setDescription(target.value)}
                    />
                    <Select
                        isMulti
                        name="tags"
                        options={tagOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={updateSelect}
                    />
                    <Select 
                        options={themeOptions} 
                        onChange={event => setTheme(event  ? event.value: "")} 
                        isClearable="true" id="themeSelect" 
                    />
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
