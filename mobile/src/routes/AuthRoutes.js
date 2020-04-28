import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { withTheme } from 'react-native-paper';

import Login from "../views/Login";
import { LOGIN_ROUTE } from '../constants';
import i18n, { LOGIN_NAVTEXT } from "../lib/i18n";

const AuthStack = createStackNavigator();

const AuthRoutes = withTheme(({ theme }) => (
  <AuthStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTitleStyle: {
        color: theme.colors.onPrimary,
      },
    }}
  >
    <AuthStack.Screen name={LOGIN_ROUTE} component={Login} options={{ title: i18n.t(LOGIN_NAVTEXT) }} />
  </AuthStack.Navigator>
));

export default AuthRoutes;
