import React, {useState} from 'react'
import {TextField, Button, Modal, Backdrop, Fade, makeStyles} from '@material-ui/core';
import {useHistory, useLocation} from "react-router-dom"
import { useSnackbar } from 'notistack';
import { observer, inject } from 'mobx-react';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4, 4, 4),
        display: 'grid',
        gridGap: theme.spacing(2),
    },
}));

function Prompt(props) {
    const classes = useStyles();
    const history = useHistory()
    const { enqueueSnackbar } = useSnackbar();
    const [password, setPassword] = useState("")
    let location = useLocation();
    
    const back = () => {
        history.push("/home")
    }

    const checkPassword = () => {
        const roomID = location.pathname.split('/')[2]
        const room = props.UserStore.rooms.find(r => r._id === roomID)
        if(password === room.roomPassword){
            props.UserStore.setRoom(room)
            props.setOpen(true)
        }else{
            enqueueSnackbar("The Password is incorrect", { variant: 'warning' })
        }
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal} open={true} closeAfterTransition
            BackdropComponent={Backdrop} BackdropProps={{timeout: 500}}
            onClose={back}
        >
            <Fade in={true}>
                <div className={classes.paper} >
                    <TextField
                        required label="Please write the Room Password"
                        value={password}
                        variant="outlined"
                        id="password"
                        type="password"
                        onChange = {({target}) => setPassword(target.value)}
                    />
                    <Button variant="contained" color="secondary" onClick={checkPassword} >
                        OK
                    </Button>
                    <Button variant="contained" color="secondary" onClick={back} >
                        Cancel
                    </Button>
                </div>
            </Fade>
        </Modal>
    )
}

export default inject("UserStore")(observer(Prompt))
