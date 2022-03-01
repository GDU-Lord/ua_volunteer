import { createSelector } from 'reselect';

/*
const initialState = {
    loading: false,
    errors: null,
};
*/

const state = (state) => state.UI;

export const loadingSelector = createSelector(state, ({ loading }) => loading);
export const errorsSelector = createSelector(state, ({ errors }) => errors);
