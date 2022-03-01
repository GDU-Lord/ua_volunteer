import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// REdux
import { connect, useDispatch, useSelector } from 'react-redux';
import { likeScream, unlikeScream } from '../../redux/actions/dataActions';
import {
    authenticatedSelector,
    likesSelector,
} from '../../redux/selectors/user';

export function LikeButton() {
    const dispatch = useDispatch();
    const likes = useSelector(likesSelector);
    const authenticated = useSelector(authenticatedSelector);

    const likedScream = () => {
        if (likes && likes.find((like) => like.screamId === screamId))
            return true;
        else return false;
    };

    const handleLikeScream = () => {
        dispatch(likeScream(screamId));
    };

    const handleUnlikeScream = () => {
        dispatch(unlikeScream(screamId));
    };

    const likeButton = !authenticated ? (
        <Link to="/login">
            <MyButton tip="Like">
                <FavoriteBorder color="primary" />
            </MyButton>
        </Link>
    ) : likedScream() ? (
        <MyButton tip="Undo like" onClick={handleUnlikeScream}>
            <FavoriteIcon color="primary" />
        </MyButton>
    ) : (
        <MyButton tip="Like" onClick={handleLikeScream}>
            <FavoriteBorder color="primary" />
        </MyButton>
    );
    return likeButton;
}

export default LikeButton;
