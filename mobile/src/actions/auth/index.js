import { signInAsync, acquireToken, tokenIsExpired } from '../../lib/auth';

// Log in
export const LOG_IN = 'login';
export const login = () => async (dispatch, getState) => {
  const { token, refreshToken } = getState().auth;

  if (!token || tokenIsExpired(token)) {
    dispatch(requestAuthData());

    // if there's no token, log in
    if (!token) {
      return signInAsync()
        .then(authData => dispatch(receiveAuthData(authData)));
    }
    
    // if there's a token and it has expired, and there is a refresh token, refresh it
    if (tokenIsExpired(token) && refreshToken) {
      return acquireToken({ refreshToken })
        .then(authData => dispatch(receiveAuthData(authData)));
    }
    
    // if there's a token and it has expired, and there is no refresh token, log in
    if (tokenIsExpired(token) && !refreshToken) {
      return signInAsync()
        .then(authData => dispatch(receiveAuthData(authData)));
    }
  }
};

// Log out
export const LOG_OUT = 'logout';
export const logout = () => ({
  type: LOG_OUT,
});

// Request Auth Data
export const REQUEST_AUTH_DATA = 'requestAuthData';
export const requestAuthData = () => ({
  type: REQUEST_AUTH_DATA,
  payload: {
    isLoggingIn: true,
  },
});

// Receive Auth Data
export const RECEIVE_AUTH_DATA = 'receiveAuthData';
export const receiveAuthData = (payload) => ({
  type: RECEIVE_AUTH_DATA,
  payload: {
    ...(payload || {}),
    isLoggingIn: false,
    lastLoggedIn: Date.now(),
  },
});
