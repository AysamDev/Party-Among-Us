import React, { useState } from 'react'
import { Modal, Backdrop, Fade, makeStyles} from '@material-ui/core';
import { observer, inject } from 'mobx-react'

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
  
function SuggestSong(props) {
    const [open, setOpen] = useState(true)
    const classes = useStyles();

    const clickEvent = async (event) => {
        const {id, dataset, innerHTML} = event.target
        // console.log(id)
        // console.log(dataset.channel)
        // console.log(innerHTML)
        await props.UserStore.suggestSong(id, innerHTML ,1)
        handleClose()
    }

    const handleClose = () => {
        setOpen(false)
        props.openSuggest(false)
    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                timeout: 500,
                }}
            >
                <Fade in={true}>
                    <div className={classes.paper} >
                        {props.items.map(i => <div id={i.id} key={i.id} data-channel={i.channel} onClick={clickEvent} >{i.title}</div> )}
                    </div>
                </Fade>
            </Modal> 
        </div>
    )
}

export default inject("UserStore")(observer(SuggestSong))
