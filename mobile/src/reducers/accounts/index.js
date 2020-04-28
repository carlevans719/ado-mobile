import { REQUEST_ACCOUNTS, RECEIVE_ACCOUNTS, SET_ACTIVE_ACCOUNT } from '../../actions/accounts';

const initialState = {
  value: [],
  count: 0,
  isLoading: true,
  lastLoaded: null,
  active: null,
};

const accountsReducer = (state = initialState, action) => {
  const nextState = { ...state };

  switch (action.type) {
    case REQUEST_ACCOUNTS:
      return {
        ...nextState,
        ...action.payload,
      };

    case RECEIVE_ACCOUNTS:
      const finalState = {
        ...nextState,
        ...action.payload,
      };

      if (!finalState.active || !finalState.value.find(account => account.accountId === finalState.active)) {
        if (finalState.value.length) {
          finalState.active = finalState.value[0].accountId;
        }
      }

      return finalState;

    case SET_ACTIVE_ACCOUNT:
      return {
        ...nextState,
        active: action.payload,
      };

    default:
      return state;
  }
};

export default accountsReducer;
