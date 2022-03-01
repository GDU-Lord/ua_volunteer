import { createSelector } from 'reselect';

/*
const initialState = {
    posters: [],
    scream: {},
    loading: false,
};
*/

const state = (state) => state.data;

export const loadingSelector = createSelector(state, ({ loading }) => loading);
export const postersSelector = createSelector(state, ({ posters }) => posters);
export const posterSelector = createSelector(state, ({ poster }) => poster);
