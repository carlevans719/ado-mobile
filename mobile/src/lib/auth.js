import * as AuthSession from 'expo-auth-session';
import Base64 from 'Base64';

import { AUTH_TOKEN_URL, AUTH_REDIRECT_URI, getAuthorizeUrl } from '../constants';
import { cacheFn } from '../lib/function';

export const signInAsync = async () => {
  try {
    // Get code
    const authorizeResult = await AuthSession.startAsync({
      authUrl: getAuthorizeUrl('abc'),
    });

    // console.log('AutorizeResult: ', authorizeResult);
    if (!authorizeResult || !authorizeResult.params || !authorizeResult.params.code) {
      return null;
    }

    // Get token
    return acquireToken({ code: authorizeResult.params.code });
  } catch (ex) {
    // console.warn(ex.message);
    return null;
  }
};

export const acquireToken = cacheFn(async ({ code, refreshToken }) => {
  try {
    const body = {
      redirectUri: AUTH_REDIRECT_URI,
    };

    if (code) {
      body.code = code;
    } else if (refreshToken) {
      body.refreshToken = refreshToken;
    }

    const response = await fetch(AUTH_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // console.log('TokenResponse: ', response);
    
    const data = await response.clone().json().catch(() => response.text())
    if (typeof data === 'string') {
      const error = new TypeError('Expected type of http response from "' + url + '" to be "object" but got "string"');
      error.additionalData = data;
      throw error;  
    }

    // console.log('TokenResponseBody: ', data);

    const [,payload] = data.access_token.split('.');
    const decoded = JSON.parse(Base64.atob(payload));

    const userRes = await fetch(`https://app.vssps.visualstudio.com/_apis/profile/profiles/me?api-version=5.1&details=true&coreAttributes=Email,Avatar,DisplayName`, {
      headers: {
        Authorization: `Bearer ${data.access_token}`,
      },
    });
  
    const user = await userRes.json();
    debugger

    return {
      id: decoded.nameid,
      decoded,
      user,
      token: data.access_token,
      refreshToken: data.refresh_token,
    };
  } catch (ex) {
    // console.warn('Unable to acquire auth token', ex);
    return null;
  }
});

export const safeParse = maybeJsonString => {
  try {
    return JSON.parse(maybeJsonString);
  } catch (e) {
    return null;
  }
};

export const decodeToken = (token) => {
  if (!token) {
    return null;
  }

  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    return null;
  }

  const decodedPayload = safeParse(Base64.atob(tokenParts[1]));
  if (!decodedPayload) {
    return null;
  }

  return decodedPayload;
};

export const tokenIsExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) {
    return true;
  }

  return new Date(decoded.exp * 1000) < new Date();
};
