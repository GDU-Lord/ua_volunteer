import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import MyButton from '../../util/MyButton';
import DeleteScream from './DeleteScream';
import PosterDialog from './PosterDialog';
import LikeButton from './LikeButton';
import NoImg from '../../images/no-img.png';
// MUI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
// Icons
import ChatIcon from '@material-ui/icons/Chat';
// Redux
import { useSelector } from 'react-redux';
import { posterSelector } from '../../redux/selectors/data';
import {
    authenticatedSelector,
    credentialsSelector,
} from '../../redux/selectors/user';

const styles = {
    card: {
        position: 'relative',
        display: 'flex',
        marginBottom: 20,
    },
    image: {
        minWidth: 200,
    },
    content: {
        padding: 25,
        objectFit: 'cover',
    },
};

function Poster({ classes, openDialog, poster }) {
    dayjs.extend(relativeTime);

    const {
        body,
        createdAt,
        userImage,
        userHandle,
        screamId,
        likeCount,
        commentCount,
    } = poster;
    const authenticated = useSelector(authenticatedSelector);
    const { handle } = useSelector(credentialsSelector);

    const deleteButton =
        authenticated && userHandle === handle ? (
            <DeleteScream screamId={screamId} />
        ) : null;

    return (
        <Card className={classes.card}>
            <CardMedia
                image={userImage}
                title="Profile image"
                className={classes.image}
            />
            <CardContent className={classes.content}>
                <Typography
                    variant="h5"
                    component={Link}
                    to={`/users/${userHandle}`}
                    color="primary"
                >
                    {userHandle}
                </Typography>
                {deleteButton}
                <Typography variant="body2" color="textSecondary">
                    {dayjs(createdAt).fromNow()}
                </Typography>
                <Typography variant="body1">{body}</Typography>
                <LikeButton screamId={screamId} />
                <span>{likeCount} Вподобання</span>
                <MyButton tip="comments">
                    <ChatIcon color="primary" />
                </MyButton>
                <span>{commentCount} Коментарі</span>
                <PosterDialog
                    screamId={screamId}
                    userHandle={userHandle}
                    openDialog={openDialog}
                />
            </CardContent>
        </Card>
    );
}

export default withStyles(styles)(Poster);
