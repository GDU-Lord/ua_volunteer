import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppIcon from '../../images/icon.png';
import MyButton from '../../util/MyButton';
import PostPoster from '../scream/PostPoster';
import Notifications from './Notifications';
// MUI stuff
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
// Icons
import HomeIcon from '@material-ui/icons/Home';
import { authenticatedSelector } from '../../redux/selectors/user';
import { withStyles } from '@material-ui/core';

const styles = (theme) => ({
    ...theme,
});

function Navbar({ classes }) {
    const authenticated = useSelector(authenticatedSelector);

    return (
        <AppBar>
            <Toolbar className="nav-container">
                {authenticated ? (
                    <Fragment>
                        <PostPoster />
                        <Link to="/">
                            <MyButton tip="Home">
                                <HomeIcon />
                            </MyButton>
                        </Link>
                        <Notifications />
                    </Fragment>
                ) : (
                    <div className="nav-wrapper">
                        <img
                            src={AppIcon}
                            alt="ukraine"
                            className={classes.logo}
                            width="30px"
                            height="30px"
                        />
                        <Button color="inherit" component={Link} to="/">
                            Оголошення
                        </Button>
                    </div>
                )}
            </Toolbar>
            <div className={classes.navbarTitle}>
                <h1>Русский корабль иди нахуй!</h1>
            </div>
        </AppBar>
    );
}

export default withStyles(styles)(Navbar);
