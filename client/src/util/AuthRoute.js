import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authenticatedSelector } from '../redux/selectors/user';

const AuthRoute = ({ children }) => {
    const authenticated = useSelector(authenticatedSelector);
    return authenticated === true ? <Navigate to="/" /> : children;
};

export default AuthRoute;
