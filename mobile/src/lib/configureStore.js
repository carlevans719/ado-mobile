import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from "redux-persist";
import { AsyncStorage } from 'react-native';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import createRootReducer from '../reducers';

const enhancers = [];
const middleware = [thunk];
if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger({
    collapsed: true,
    titleFormatter: (action, time, took) => `action @ ${time} ${action.type} (in ${took.toFixed(2)} ms)`,
    stateTransformer: (state) => 'omitted',
    colors: {
      title: false,
      prevState: false,
      nextState: false,
      action: false,
      error: false,
    },
  });
  // middleware.push(logger);
}

const persistedReducer = persistReducer(
  {
    key: "root",    
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
  },
  createRootReducer(),
);

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers,
);

const store = createStore(
  persistedReducer,
  {},
  composedEnhancers,
);

const persistor = persistStore(store);

global.store = store;
const getStore = () => store;
const getPersistor = () => persistor;

export {
  getStore,
  getPersistor,
};
