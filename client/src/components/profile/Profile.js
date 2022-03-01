import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import MyButton from '../../util/MyButton';
import ProfileSkeleton from '../../util/ProfileSkeleton';
import NoImg from '../../images/no-img.png';
// MUI stuff
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
//Redux
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, uploadImage } from '../../redux/actions/userActions';
import {
    authenticatedSelector,
    credentialsSelector,
    loadingSelector,
} from '../../redux/selectors/user';

const styles = (theme) => ({
    ...theme,
});

function Profile({ classes }) {
    const dispatch = useDispatch();

    const { handle, createdAt, imageUrl, bio, website, location } =
        useSelector(credentialsSelector);
    const loading = useSelector(loadingSelector);
    const authenticated = useSelector(authenticatedSelector);

    const handleImageChange = (event) => {
        const image = event.target.files[0];
        const formData = new FormData();
        formData.append('image', image, image.name);
        dispatch(uploadImage(formData));
    };

    const handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    let profileMarkup = !loading ? (
        authenticated ? (
            <Paper className={classes.paper}>
                <div className={classes.profile}>
                    <div className="image-wrapper">
                        <img
                            src={imageUrl || NoImg}
                            alt="profile"
                            className="profile-image"
                        />
                        <input
                            type="file"
                            id="imageInput"
                            hidden="hidden"
                            onChange={handleImageChange}
                        />
                        <MyButton
                            tip="Edit profile picture"
                            onClick={handleEditPicture}
                            btnClassName="button"
                        >
                            <EditIcon color="primary" />
                        </MyButton>
                    </div>
                    <hr />
                    <div className="profile-details">
                        <MuiLink
                            component={Link}
                            to={`/users/${handle}`}
                            color="primary"
                            variant="h5"
                        >
                            @{handle}
                        </MuiLink>
                        <hr />
                        {bio && <Typography variant="body2">{bio}</Typography>}
                        <hr />
                        {location && (
                            <Fragment>
                                <LocationOn color="primary" />{' '}
                                <span>{location}</span>
                                <hr />
                            </Fragment>
                        )}
                        {website && (
                            <Fragment>
                                <LinkIcon color="primary" />
                                <a
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {' '}
                                    {website}
                                </a>
                                <hr />
                            </Fragment>
                        )}
                        <CalendarToday color="primary" />{' '}
                        <span>
                            Зареєструвався {dayjs(createdAt).format('MMM YYYY')}
                        </span>
                    </div>
                    <MyButton tip="Logout" onClick={handleLogout}>
                        <KeyboardReturn color="primary" />
                    </MyButton>
                    <EditDetails />
                </div>
            </Paper>
        ) : (
            <Paper className={classes.paper}>
                <Typography variant="body2" align="center">
                    Користувач не знайдено, будь ласка, увійдіть спочатку
                </Typography>
                <div className={classes.buttons}>
                    <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to="/login"
                    >
                        Увійти
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/signup"
                    >
                        Реєструватися
                    </Button>
                </div>
            </Paper>
        )
    ) : (
        <ProfileSkeleton />
    );

    return profileMarkup;
}

Profile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Profile);
