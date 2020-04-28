import * as WebBrowser from 'expo-web-browser';
import { Alert } from 'react-native';

import { receiveAuthData, login } from '../actions/auth';

export const httpFetch = async (url, options = {}, ...otherParams) => {
  const makeRequest = async (token) => {
    const response = await fetch(
      url,
      {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      },
      ...otherParams,
    );

    const data = await response.clone().json().catch(() => response.text())
    if (typeof data === 'string') {
      throw new TypeError('Expected type of http response from "' + url + '" to be "object" but got "string"');
    }

    return data;
  };

  try {
    const { token, decoded } = global.store.getState().auth;
    if (!token || !decoded || new Date(decoded.exp * 1000) < new Date()) {
      throw new Error('Auth token missing or expired');
    }

    return await makeRequest(token);
  } catch (ex) {
    // console.warn(ex.message);

    try {
      const loginRes = await global.store.dispatch(login());
      return new Promise(resolve => {
        setTimeout(() => {
          makeRequest(loginRes.payload?.token)
            .then(resolve)
            .catch(() => {
              global.store.dispatch(receiveAuthData(null));
            });
        }, 200)
      });
    } catch (ex1) {
      global.store.dispatch(receiveAuthData(null));
      // console.error('Unable to obtain auth token', ex1.message);
    }
  }
};

export const openUrl = async (url) => {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (ex) {
    // console.warn(ex.message);
    Alert.alert(
      `Problem loading link`,
      `There was a problem opening the link to "${url}"`,
      [
        { text: 'OK', onPress: () => {} },
      ],
    );
  }
};
