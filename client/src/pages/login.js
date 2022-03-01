import React, { useEffect, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import AppIcon from '../images/icon.png';
import { Link } from 'react-router-dom';

// MUI Stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
// Redux stuff
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';
import { errorsSelector, loadingSelector } from '../redux/selectors/ui';

const styles = (theme) => ({
    ...theme,
});

function Login({ classes, history }) {
    const dispatch = useDispatch();
    const loading = useSelector(loadingSelector);
    const errorsUI = useSelector(errorsSelector);

    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        if (errorsUI !== errors) {
            setErrors({ errors: errorsUI });
        }
    }, [errorsUI]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const userData = {
            email: formData.email,
            password: formData.password,
        };
        dispatch(loginUser(userData, history));
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <Grid container className={classes.form}>
            <Grid item sm />
            <Grid item sm>
                <img
                    src={AppIcon}
                    alt="ukraine"
                    className={classes.image}
                    width="70px"
                    height="70px"
                />
                <Typography variant="h2" className={classes.pageTitle}>
                    Увійти
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        className={classes.textField}
                        helperText={errors?.email}
                        error={errors?.email ? true : false}
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        className={classes.textField}
                        helperText={errors?.password}
                        error={errors?.password ? true : false}
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                    />
                    {errors.general && (
                        <Typography
                            variant="body2"
                            className={classes.customError}
                        >
                            {errors.general}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        disabled={loading}
                    >
                        Увійти
                        {loading && (
                            <CircularProgress
                                size={30}
                                className={classes.progress}
                            />
                        )}
                    </Button>
                    <br />
                    <small>
                        Немає акаунта? Реєструйся <Link to="/signup">тут</Link>
                    </small>
                </form>
            </Grid>
            <Grid item sm />
        </Grid>
    );
}

export default withStyles(styles)(Login);
