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
import { signupUser } from '../redux/actions/userActions';
import { errorsSelector } from '../redux/selectors/ui';

const styles = (theme) => ({
    ...theme,
});

function Signup({ classes, history }) {
    const dispatch = useDispatch();
    const errorsUI = useSelector(errorsSelector);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        socials: [''],
        telegramId: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (errorsUI !== errors) {
            setErrors({ errors: errorsUI });
        }
    }, [errorsUI]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);

        const newUserData = {
            fullName: formData.fullName,
            phone: formData.phone,
            socials: formData.socials,
            telegramId: formData.telegramId,
        };

        dispatch(signupUser(newUserData, history));
    };

    return (
        <Grid container className={classes.form}>
            <Grid item sm />
            <Grid item sm>
                <img src={AppIcon} alt="monkey" className={classes.image} />
                <Typography variant="h2" className={classes.pageTitle}>
                    Реєстрація
                </Typography>
                <form noValidate onSubmit={handleSubmit}>
                    <TextField
                        id="fullName"
                        name="fullName"
                        type="text"
                        label="Повне ім'я"
                        className={classes.textField}
                        helperText={errors.fullName}
                        error={errors.fullName ? true : false}
                        value={formData.fullName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        id="phone"
                        name="phone"
                        type="phone"
                        label="Телефон"
                        className={classes.textField}
                        helperText={errors.phone}
                        error={errors.phone ? true : false}
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        id="socials"
                        name="socials"
                        type="text"
                        label="Посилання на соцільні мережі"
                        className={classes.textField}
                        helperText={errors.socials}
                        error={errors.socials ? true : false}
                        value={formData.socials}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        id="telegramId"
                        name="telegramId"
                        type="text"
                        label="Телеграм посилання користувача"
                        className={classes.textField}
                        helperText={errors.telegramId}
                        error={errors.telegramId ? true : false}
                        value={formData.telegramId}
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
                        Реєстрація
                        {loading && (
                            <CircularProgress
                                size={30}
                                className={classes.progress}
                            />
                        )}
                    </Button>
                    <br />
                    <small>
                        Вже маєш акаунт ? Зайти <Link to="/login">тут</Link>
                    </small>
                </form>
            </Grid>
            <Grid item sm />
        </Grid>
    );
}

export default withStyles(styles)(Signup);
