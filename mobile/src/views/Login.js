import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, StyleSheet } from 'react-native';
import { Subheading, withTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import { login } from '../actions/auth';
import i18n, { LOGIN_BTN, LOGIN_MESSAGE } from '../lib/i18n';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  subheading: {
    marginHorizontal: 50,
    textAlign: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

const Login = () => {
  const dispatch = useDispatch();
  const isLoggingIn = useSelector(state => state.auth.isLoggingIn);

  return (
    <SafeAreaView style={styles.root}>
      <Image style={styles.logo} source={require('../../assets/icon.png')} />

      <Subheading style={styles.subheading}>{i18n.t(LOGIN_MESSAGE)}</Subheading>
   
      <Button
        icon="microsoft"
        mode="contained"
        loading={isLoggingIn}
        // disabled={isLoggingIn}
        onPress={() => dispatch(login())}
      >
        {i18n.t(LOGIN_BTN)}
      </Button>

    </SafeAreaView>
  );
};

export default withTheme(Login);
