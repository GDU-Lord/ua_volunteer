import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import jwtDecode from 'jwt-decode';
// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
// Components
import Navbar from './components/layout/Navbar';
import themeObject from './util/theme';
import AuthRoute from './util/AuthRoute';
// Pages
import Posters from './pages/posters';
import Login from './pages/login';
import Signup from './pages/signup';
import User from './pages/user';

import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/uk';

const theme = createMuiTheme(themeObject);
dayjs.locale('uk');

// axios.defaults.baseURL =
//     'https://europe-west1-socialape-d081e.cloudfunctions.net/api';

axios.defaults.baseURL = 'http://localhost:80';

// const token = localStorage.FBIdToken;
// if (token) {
//     const decodedToken = jwtDecode(token);
//     if (decodedToken.exp * 1000 < Date.now()) {
//         store.dispatch(logoutUser());
//         window.location.href = '/login';
//     } else {
//         store.dispatch({ type: SET_AUTHENTICATED });
//         axios.defaults.headers.common['Authorization'] = token;
//         store.dispatch(getUserData());
//     }
// }

function App() {
    return (
        <MuiThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter>
                    <h1>Русский военный корабль, иди на хуй</h1>
                    <Navbar />
                    <div className="container">
                        <Routes>
                            <Route index path="/" element={<Posters />} />
                            <Route
                                path="/login"
                                element={
                                    <AuthRoute>
                                        <Login />
                                    </AuthRoute>
                                }
                            />
                            <Route
                                path="/signup"
                                element={
                                    <AuthRoute>
                                        <Signup />
                                    </AuthRoute>
                                }
                            />
                            <Route path="/users/:handle" element={<User />} />
                            <Route
                                path="/users/:handle/scream/:screamId"
                                element={<User />}
                            />
                        </Routes>
                    </div>
                </BrowserRouter>
            </Provider>
        </MuiThemeProvider>
    );
}

export default App;
