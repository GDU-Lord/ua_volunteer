import { createSelector } from 'reselect';

/*
const initialState = {
    authenticated: false,
    loading: false,
    credentials: {},
    likes: [],
    notifications: [],
};
*/

const state = (state) => state.user;

export const authenticatedSelector = createSelector(
    state,
    ({ authenticated }) => authenticated
);
export const loadingSelector = createSelector(state, ({ loading }) => loading);
export const credentialsSelector = createSelector(
    state,
    ({ credentials }) => credentials
);
export const likesSelector = createSelector(state, ({ likes }) => likes);
export const notificationsSelector = createSelector(
    state,
    ({ notifications }) => notifications
);
