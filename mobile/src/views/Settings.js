import React from 'react';
import { useDispatch } from 'react-redux';
import { List } from 'react-native-paper';

import i18n, { SETTINGS_ACCOUNT_TITLE, LOGOUT_BTN } from '../lib/i18n';
import { logout } from '../actions/auth';

const Settings = () => {
  const dispatch = useDispatch();
  
  return (
    <List.Section>
      <List.Subheader>{i18n.t(SETTINGS_ACCOUNT_TITLE)}</List.Subheader>

      <List.Item
        title={i18n.t(LOGOUT_BTN)}
        onPress={() => dispatch(logout())}
      />

    </List.Section>
  );
}

export default Settings