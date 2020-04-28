import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { receiveNavigation } from '../actions/navigation';
import AuthRoutes from './AuthRoutes';
import AppRoutes from './AppRoutes';

const Main = () => {
  const token = useSelector(state => state.auth.token);
  const navigationState = __DEV__ ? useSelector(state => state.navigation) : undefined;
  const dispatch = useDispatch();

  const onStateChange = useCallback(
    state => dispatch(receiveNavigation(state)),
    [receiveNavigation]
  );

  return (
    <NavigationContainer
      initialState={navigationState}
      onStateChange={onStateChange}
    >
      {token
        ? <AppRoutes />
        : <AuthRoutes />
      }
    </NavigationContainer>
  );
};

export default Main;
