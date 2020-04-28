import React, { useEffect, useState } from "react";
import * as Expo from 'expo';
import * as Font from 'expo-font';
import { Provider as StateProvider } from 'react-redux';
import { Provider as PaperProvider, DefaultTheme } from "react-native-paper";
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getStore, getPersistor } from './src/lib/configureStore';
import Main from './src/routes';

const defaultTheme = {
  ...DefaultTheme,
  colors: {
    // Primary = Light Blue 500
    // Secondary = Deep Purple A 200
    ...DefaultTheme.colors,
    primary: '#03A9F4',
    onPrimay: '#000000',
    primaryLight: '#67DAFF',
    onPrimaryLight: '#000000',
    primaryDark: '#007AC1',
    onPrimaryDark: '#000000',
    accent: '#7C4DFF',
    onAccent: '#FFFFFF',
    accentLight: '#B47CFF',
    onAccentLight: '#000000',
    accentDark: '#3F1DCB',
    onAccentDark: '#FFFFFF',
    background: '#E2E3E2',
    onBackground: '#000000',
    surface: '#F5F5F5',
    onSurface: '#000000',
    text: '#000000',
    // Blue Grey 300
    outline: '#90a4ae'
    // disabled: '#FF0000',
    // placeholder: '#',
    // backdrop: '#E2E3E2',
  },
  fonts: {
    regular: {
      fontFamily: 'WorkSans-Regular',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'WorkSans-Medium',
    },
    light: {
      fontFamily: 'WorkSans-Light',
    },
    thin: {
      fontFamily: 'WorkSans-Thin',
    },
  },
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    Font.loadAsync({
      'Courier': require('./assets/fonts/Courier-Regular.ttf'),
      'Courier-Bold': require('./assets/fonts/Courier-BoldRegular.ttf'),
      'WorkSans-Regular': require('./assets/fonts/WorkSans-VariableFont_wght.ttf'),
      'WorkSans-Medium': require('./assets/fonts/WorkSans-Medium.ttf'),
      'WorkSans-Light': require('./assets/fonts/WorkSans-Light.ttf'),
      'WorkSans-Thin': require('./assets/fonts/WorkSans-Thin.ttf'),
    }).then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Expo.AppLoading />
  }

  return (
    <SafeAreaProvider>
      <StateProvider store={getStore()}>
        <PersistGate persistor={getPersistor()} loading={<Expo.AppLoading />}>
          <PaperProvider theme={defaultTheme}>

              <Main />

          </PaperProvider>
        </PersistGate>
      </StateProvider>
    </SafeAreaProvider>
  );
};

export default App;
