import React from 'react';
import { List, TouchableRipple } from 'react-native-paper';
import Avatar from './Avatar';

const AccountsListItem = ({ name, onPress }) => (
  <TouchableRipple onPress={onPress}>
    <List.Item
      title={name}
      left={() => <Avatar.Text style={{ height: 45, width: 45, marginRight: 10 }} label={name.slice(0, 1).toUpperCase()} />}
    />
  </TouchableRipple>
);

export default AccountsListItem;
