import React, {useState} from 'react'
import {TextField, Button, Modal, Backdrop, Fade, makeStyles} from '@material-ui/core';
import { observer, inject } from 'mobx-react'
import Select from 'react-select'
import { useSnackbar } from 'notistack';

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

function UserForm(props) {
    const classes = useStyles();
    const [userName, setUserName] = useState("")
    const [avatar, setAvatar] = useState("")
    const { enqueueSnackbar } = useSnackbar();
    
    const avatarOptions = props.UserStore.avatars.map((a, i )=> ({label: a.name, value: i}))
    const openRoom = () => {
        if(!userName || !avatar){
            enqueueSnackbar('some fields are missing', { variant: 'warning' })
        }else{
            props.UserStore.addUser(userName, avatar)
            props.open(false)
        }
    }
    
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={true}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={true}>
                <div className={classes.paper} >
                    <TextField
                        required label="User Name"
                        value={userName}
                        variant="outlined"
                        id="userName"
                        onChange = {({target}) => setUserName(target.value)}
                    />
                    <Select 
                        options={avatarOptions} 
                        onChange={event => setAvatar(event  ? event.label: "")} 
                        isClearable="true" id="themeSelect" 
                    />
                    <Button variant="contained" color="secondary" onClick={openRoom} >
                        Submit
                    </Button>
                </div>
                </Fade>
            </Modal>
        </div>
    )
}

export default inject("UserStore")(observer(UserForm))
