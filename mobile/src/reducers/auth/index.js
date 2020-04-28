import { LOG_OUT, REQUEST_AUTH_DATA, RECEIVE_AUTH_DATA } from '../../actions/auth';

const initialState = {
  id: null,
  decoded: null,
  token: null,
  refreshToken: null,
  isLoggingIn: false,
  lastLoggedIn: null,
};

const authReducer = (state = initialState, action) => {
  const nextState = { ...state };

  switch (action.type) {
    case LOG_OUT:
      return {
        ...nextState,
        ...initialState,
      };

    case REQUEST_AUTH_DATA:
      return {
        ...nextState,
        ...action.payload,
      };

    case RECEIVE_AUTH_DATA:
      return {
        ...initialState,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default authReducer;
