import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../../util/MyButton';
// Redux stuff
import { useSelector } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';
// MUI Stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// Icons
import EditIcon from '@material-ui/icons/Edit';
import { credentialsSelector } from '../../redux/selectors/user';

const styles = (theme) => ({
    ...theme,
    button: {
        float: 'right',
    },
});

function EditDetails({ classes }) {
    const credentials = useSelector(credentialsSelector);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        website: '',
        location: '',
    });

    const mapUserDetailsToState = (credentials) => {
        setFormData({
            bio: credentials.bio ? credentials.bio : '',
            website: credentials.website ? credentials.website : '',
            location: credentials.location ? credentials.location : '',
        });
    };

    const handleOpen = () => {
        setIsOpen(true);
        mapUserDetailsToState(props.credentials);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };
    const handleSubmit = () => {
        const userDetails = {
            bio: formData.bio,
            website: formData.website,
            location: formData.location,
        };

        editUserDetails(userDetails);
        handleClose();
    };

    useEffect(() => {
        mapUserDetailsToState(credentials);
    }, []);

    return (
        <Fragment>
            <MyButton
                tip="Edit Details"
                onClick={handleOpen}
                btnClassName={classes.button}
            >
                <EditIcon color="primary" />
            </MyButton>
            <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Редагуйте ваші деталі</DialogTitle>
                <DialogContent>
                    <form>
                        <TextField
                            name="bio"
                            tpye="text"
                            label="Bio"
                            multiline
                            rows="3"
                            placeholder="A short bio about yourself"
                            className={classes.textField}
                            value={formData.bio}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name="website"
                            tpye="text"
                            label="Website"
                            placeholder="Your personal/professinal website"
                            className={classes.textField}
                            value={formData.website}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            name="location"
                            tpye="text"
                            label="Location"
                            placeholder="Where you live"
                            className={classes.textField}
                            value={formData.location}
                            onChange={handleChange}
                            fullWidth
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Відмінити
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Зберегти
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

EditDetails.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditDetails);
