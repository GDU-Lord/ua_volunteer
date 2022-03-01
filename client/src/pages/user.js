import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Poster from '../components/scream/Poster';
import StaticProfile from '../components/profile/StaticProfile';
import Grid from '@material-ui/core/Grid';

import PosterSkeleton from '../util/PostersSkeleton';
import ProfileSkeleton from '../util/ProfileSkeleton';

import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';
import { loadingSelector, postersSelector } from '../redux/selectors/data';

function User(props) {
    const dispatch = useDispatch();
    const posters = useSelector(postersSelector);
    const loading = useSelector(loadingSelector);
    const [profile, setProfile] = useState(null);
    const [posterIdParam, setPosterIdParam] = useState(null);

    useEffect(() => {
        const handle = props?.handle;
        const posterId = props?.posterId;

        if (posterId) setPosterIdParam(posterId);

        dispatch(getUserData(handle));
        axios
            .get(`/user/${handle}`)
            .then((res) => {
                setProfile(res.data.user);
            })
            .catch((err) => console.log(err));
    }, []);

    const postersMarkup = loading ? (
        <PosterSkeleton />
    ) : posters === null ? (
        <p>У цього користувача ще немає оголошень</p>
    ) : !posterIdParam ? (
        posters.map((scream) => (
            <Poster key={scream.screamId} scream={scream} />
        ))
    ) : (
        posters.map((scream) => {
            if (scream.screamId !== posterIdParam)
                return <Poster key={scream.screamId} scream={scream} />;
            else
                return (
                    <Poster key={scream.screamId} scream={scream} openDialog />
                );
        })
    );

    return (
        <Grid container spacing={16}>
            <Grid item sm={8} xs={12}>
                {postersMarkup}
            </Grid>
            <Grid item sm={4} xs={12}>
                {profile === null ? (
                    <ProfileSkeleton />
                ) : (
                    <StaticProfile profile={profile} />
                )}
            </Grid>
        </Grid>
    );
}

export default User;
