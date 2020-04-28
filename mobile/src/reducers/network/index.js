import { SET_NETWORK_CONNECTION_STATUS } from '../../actions/network';

const initialState = {
  isConnected: true,
};

const networkReducer = (state = initialState, action) => {
  const nextState = { ...state };

  switch (action.type) {
    case SET_NETWORK_CONNECTION_STATUS:
      return {
        ...nextState,
        isConnected: action.payload.isConnected,
      };

    default:
      return state;
  }
};

export default networkReducer;
