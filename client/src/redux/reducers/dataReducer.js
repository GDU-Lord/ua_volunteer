import {
    SET_POSTERS,
    LIKE_POSTER,
    UNLIKE_POSTER,
    LOADING_DATA,
    DELETE_POSTER,
    POST_POSTER,
    SET_POSTER,
    SUBMIT_COMMENT,
} from '../types';

const initialState = {
    posters: [],
    poster: {},
    loading: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOADING_DATA:
            return {
                ...state,
                loading: true,
            };
        case SET_POSTERS:
            return {
                ...state,
                posters: action.payload,
                loading: false,
            };
        case SET_POSTER:
            return {
                ...state,
                poster: action.payload,
            };
        case LIKE_POSTER:
        case UNLIKE_POSTER:
            let index = state.posters.findIndex(
                (poster) => poster.posterId === action.payload.posterId
            );
            state.posters[index] = action.payload;
            if (state.poster.posterId === action.payload.posterId) {
                state.poster = action.payload;
            }
            return {
                ...state,
            };
        case DELETE_POSTER:
            index = state.posters.findIndex(
                (poster) => poster.posterId === action.payload
            );
            state.posters.splice(index, 1);
            return {
                ...state,
            };
        case POST_POSTER:
            return {
                ...state,
                posters: [action.payload, ...state.posters],
            };
        case SUBMIT_COMMENT:
            return {
                ...state,
                poster: {
                    ...state.poster,
                    comments: [action.payload, ...state.poster.comments],
                },
            };
        default:
            return state;
    }
}
