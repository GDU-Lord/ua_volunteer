import {
    SET_POSTERS,
    LOADING_DATA,
    LIKE_POSTER,
    UNLIKE_POSTER,
    DELETE_POSTER,
    SET_ERRORS,
    POST_POSTER,
    CLEAR_ERRORS,
    LOADING_UI,
    SET_POSTER,
    STOP_LOADING_UI,
    SUBMIT_COMMENT,
} from '../types';
import axios from 'axios';

// Get all screams
export const getScreams = () => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .get('/screams')
        .then((res) => {
            console.log('res', res);
            dispatch({
                type: SET_POSTERS,
                payload: res.data,
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_POSTERS,
                payload: [],
            });
        });
};
export const getScream = (screamId) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .get(`/scream/${screamId}`)
        .then((res) => {
            dispatch({
                type: SET_POSTER,
                payload: res.data,
            });
            dispatch({ type: STOP_LOADING_UI });
        })
        .catch((err) => {
            dispatch({ type: STOP_LOADING_UI });
            console.log(err);
        });
};
// Post a scream
export const postScream = (newScream) => (dispatch) => {
    dispatch({ type: LOADING_UI });
    axios
        .post('/scream', newScream)
        .then((res) => {
            dispatch({
                type: POST_POSTER,
                payload: res.data,
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            });
        });
};
// Like a scream
export const likeScream = (screamId) => (dispatch) => {
    axios
        .get(`/scream/${screamId}/like`)
        .then((res) => {
            dispatch({
                type: LIKE_POSTER,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};
// Unlike a scream
export const unlikeScream = (screamId) => (dispatch) => {
    axios
        .get(`/scream/${screamId}/unlike`)
        .then((res) => {
            dispatch({
                type: UNLIKE_POSTER,
                payload: res.data,
            });
        })
        .catch((err) => console.log(err));
};
// Submit a comment
export const submitComment = (screamId, commentData) => (dispatch) => {
    axios
        .post(`/scream/${screamId}/comment`, commentData)
        .then((res) => {
            dispatch({
                type: SUBMIT_COMMENT,
                payload: res.data,
            });
            dispatch(clearErrors());
        })
        .catch((err) => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data,
            });
        });
};
export const deleteScream = (screamId) => (dispatch) => {
    axios
        .delete(`/scream/${screamId}`)
        .then(() => {
            dispatch({ type: DELETE_POSTER, payload: screamId });
        })
        .catch((err) => console.log(err));
};

export const getUserData = (userHandle) => (dispatch) => {
    dispatch({ type: LOADING_DATA });
    axios
        .get(`/user/${userHandle}`)
        .then((res) => {
            dispatch({
                type: SET_POSTERS,
                payload: res.data.screams,
            });
        })
        .catch(() => {
            dispatch({
                type: SET_POSTERS,
                payload: null,
            });
        });
};

export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
