// import { delay } from 'redux-saga';
import { delay, put, call } from 'redux-saga/effects';
import * as actions from '../actions/index';
import axios from 'axios';

export function* logoutSaga(action) {
    // easier to mock this way
    yield call([localStorage, 'removeItem'], "token");
    yield call([localStorage, 'removeItem'], "expirationDate");
    yield call([localStorage, 'removeItem'], "userId");
    // // difficult to mock for testing
    // yield localStorage.removeItem('token');
    // yield localStorage.removeItem('expirationDate');
    // yield localStorage.removeItem('userId');
    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actions.logout());
}

export function* authUserSaga(action) {
    yield put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    };

    // const apiKey = 'AIzaSyDca6kRSGVFeIMfsxc466QxBtvAuVQwU7A'; // old key on git
    const apiKey = 'AIzaSyDrj1sXeriUqHhUzNZ9z1w4YFrpjT4CilI';
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + apiKey;
    if (!action.isSignup) {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + apiKey;
    }

    try {
        const response = yield axios.post(url, authData);
        const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
        yield localStorage.setItem('token', response.data.idToken);
        yield localStorage.setItem('userId', response.data.localId);
        yield localStorage.setItem('expirationDate', expirationDate);
        yield put(actions.authSuccess(response.data.idToken, response.data.localId));
        yield put(actions.checkAuthTimeout(response.data.expiresIn));
    } catch (error) {
        yield put(actions.authFail(error.response.data.error));
    }
}

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token');
    if (!token) {
        yield put(actions.logout());
    } else {
        const expirationDate = yield new Date(localStorage.getItem('expirationDate'));

        if (expirationDate <= new Date()) {
            yield put(actions.logout());
        } else {
            const userId = yield localStorage.getItem('userId');
            yield put(actions.authSuccess(token, userId));
            yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
        }
    }
}