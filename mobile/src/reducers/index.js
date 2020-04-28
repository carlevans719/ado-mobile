import { combineReducers } from 'redux';

import { LOG_OUT } from '../actions/auth';

import accountsReducer from './accounts';
import authReducer from './auth';
import navigationReducer from './navigation';
import networkReducer from './network';
import projectsReducer from './projects';

const combinedReducer = combineReducers({
  accounts: accountsReducer,
  auth: authReducer,
  navigation: navigationReducer,
  network: networkReducer,
  projects: projectsReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }

  return combinedReducer(state, action);
};

export default () => rootReducer;
