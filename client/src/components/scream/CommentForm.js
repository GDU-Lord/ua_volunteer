import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
// MUI Stuff
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// Redux stuff
import { connect, useDispatch, useSelector } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';
import { errorsSelector, loadingSelector } from '../../redux/selectors/ui';
import { authenticatedSelector } from '../../redux/selectors/user';

const styles = (theme) => ({
    ...theme,
});

function CommentForm(props) {
    const dispatch = useDispatch();
    const errorsUI = useSelector(errorsSelector);
    const loading = useSelector(loadingSelector);

    const authenticated = useSelector(authenticatedSelector);

    const [formData, setFormData] = useState({
        body: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (errorsUI !== errors) {
            setErrors({ errors: errorsUI });
        }
        if (!errorsUI && !loading) {
            setFormData({ ...formData, body: '' });
        }
    }, [errorsUI, loading]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(
            submitComment(props.screamId, {
                body: formData.body,
            })
        );
    };

    const commentFormMarkup = authenticated ? (
        <Grid item sm={12} style={{ textAlign: 'center' }}>
            <form onSubmit={handleSubmit}>
                <TextField
                    name="body"
                    type="text"
                    label="Comment on scream"
                    error={errors?.comment ? true : false}
                    helperText={errors?.comment}
                    value={formData.body}
                    onChange={handleChange}
                    fullWidth
                    className={classes.textField}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                >
                    Надіслати
                </Button>
            </form>
            <hr className={classes.visibleSeparator} />
        </Grid>
    ) : null;
    return commentFormMarkup;
}

CommentForm.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommentForm);
