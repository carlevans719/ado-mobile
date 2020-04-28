import { httpFetch } from '../../lib/http';

export const FETCH_ACCOUNTS = 'fetchAccounts';
export const fetchAccounts = (id) => async (dispatch) => {
  dispatch(requestAccounts());

  return httpFetch(`https://app.vssps.visualstudio.com/_apis/accounts?api-version=5.1&memberId=${id}`)
    .then(accountData => dispatch(receiveAccounts(accountData)));
};

export const SET_ACTIVE_ACCOUNT = 'setActiveAccount';
export const setActiveAccount = (accountId) => ({
  type: SET_ACTIVE_ACCOUNT,
  payload: accountId,
});

export const REQUEST_ACCOUNTS = 'requestAccounts';
export const requestAccounts = () => ({
  type: REQUEST_ACCOUNTS,
  payload: {
    isLoading: true,
  },
});

export const RECEIVE_ACCOUNTS = 'receiveAccounts';
export const receiveAccounts = (payload) => ({
  type: RECEIVE_ACCOUNTS,
  payload: {
    ...payload,
    isLoading: false,
    lastLoaded: Date.now(),
  },
});
