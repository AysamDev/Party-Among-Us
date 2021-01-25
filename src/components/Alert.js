import React from 'react';
import { Button, Modal, Backdrop, Fade, makeStyles } from '@material-ui/core';
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
        padding: theme.spacing(4, 4, 4),
        display: 'grid',
        gridGap: theme.spacing(2)
    }
}));

function Alert(props) {
    const classes = useStyles(),
        history = useHistory();

    const back = () => {
        history.push("/");
    }

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal} open={true} closeAfterTransition
            BackdropComponent={Backdrop} BackdropProps={{ timeout: 500 }}
            onClose={back}
        >
            <Fade in={true}>
                <div className={classes.paper} >
                    <h2>{props.text}</h2>
                    <Button variant="contained" color="secondary" onClick={back} >
                        OK
                    </Button>
                </div>
            </Fade>
        </Modal>
    )
}

export default Alert;