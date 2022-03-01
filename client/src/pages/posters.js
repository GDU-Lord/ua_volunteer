import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import Poster from '../components/scream/Poster';
import Profile from '../components/profile/Profile';
import PostersSkeleton from '../util/PostersSkeleton';

import { getScreams } from '../redux/actions/dataActions';
import { loadingSelector, postersSelector } from '../redux/selectors/data';

function Posters() {
    const dispatch = useDispatch();
    const posters = useSelector(postersSelector);
    const loading = useSelector(loadingSelector);

    useEffect(() => {
        dispatch(getScreams());
    }, []);

    let recentScreamsMarkup = !loading ? (
        posters?.map((poster) => (
            <Poster key={poster.screamId} poster={poster} />
        ))
    ) : (
        <PostersSkeleton />
    );

    return (
        <Grid container spacing={16}>
            <Grid item sm={8} xs={12}>
                {recentScreamsMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                <Profile />
            </Grid>
        </Grid>
    );
}

export default Posters;
