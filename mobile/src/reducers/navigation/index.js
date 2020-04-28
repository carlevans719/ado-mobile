import { RECEIVE_NAVIGATION } from '../../actions/navigation';

const initialState = null;

const navigationReducer = (state = initialState, action) => {
  const nextState = { ...state };

  switch (action.type) {
    case RECEIVE_NAVIGATION:
      return {
        ...nextState,
        ...action.payload,
      };

    default:
      return state;
  }
};

export default navigationReducer;
