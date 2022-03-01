import React, { useState, Fragment, useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
// Redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { postScream, clearErrors } from '../../redux/actions/dataActions';
import { errorsSelector } from '../../redux/selectors/ui';
import { loadingSelector } from '../../redux/selectors/user';

const styles = (theme) => ({
    ...theme,
    submitButton: {
        position: 'relative',
        float: 'right',
        marginTop: 10,
    },
    progressSpinner: {
        position: 'absolute',
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '6%',
    },
});

function PostPoster({ classes }) {
    const dispatch = useDispatch();

    const errorsUI = useSelector(errorsSelector);
    const isLoading = useSelector(loadingSelector);

    const [isOpen, setIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        body: '',
    });

    useEffect(() => {
        if (errorsUI !== errors) {
            setErrors({ errors: errorsUI });
        }
        if (!errorsUI && !isLoading) {
            setFormData({ ...formData, body: '' });
            setIsOpen(false);
            setErrors({});
        }
    }, [errorsUI, isLoading]);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        dispatch(clearErrors());
        setIsOpen(false);
        setErrors({});
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(postScream({ body: formData.body }));
    };

    return (
        <Fragment>
            <MyButton onClick={handleOpen} tip="Створити оголошення!">
                <AddIcon />
            </MyButton>
            <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
                <MyButton
                    tip="Закрити"
                    onClick={handleClose}
                    tipClassName={classes.closeButton}
                >
                    <CloseIcon />
                </MyButton>
                <DialogTitle>Створити нове оголошення</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="body"
                            type="text"
                            label="Створити оголошення"
                            multiline
                            rows="3"
                            placeholder="Оголошення"
                            error={errors.body ? true : false}
                            helperText={errors.body}
                            className={classes.textField}
                            onChange={handleChange}
                            fullWidth
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submitButton}
                            disabled={isLoading}
                        >
                            Надіслати
                            {isLoading && (
                                <CircularProgress
                                    size={30}
                                    className={classes.progressSpinner}
                                />
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
}

export default withStyles(styles)(PostPoster);
