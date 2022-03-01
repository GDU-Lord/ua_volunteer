import React, { Component, Fragment, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

// MUI Stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect, useDispatch } from 'react-redux';
import { deleteScream } from '../../redux/actions/dataActions';

const styles = {
    deleteButton: {
        position: 'absolute',
        left: '90%',
        top: '10%',
    },
};

function DeleteScream({ classes, screamId }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);
    };
    const deleteScream = () => {
        dispatch(deleteScream(screamId));
        setIsOpen(false);
    };

    return (
        <Fragment>
            <MyButton
                tip="Видалити оголошення"
                onClick={handleOpen}
                btnClassName={classes.deleteButton}
            >
                <DeleteOutline color="secondary" />
            </MyButton>
            <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Ви впевненні, що хочете видалити це оголошення?
                </DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Відмінити
                    </Button>
                    <Button onClick={deleteScream} color="secondary">
                        Видалити
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

DeleteScream.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeleteScream);
