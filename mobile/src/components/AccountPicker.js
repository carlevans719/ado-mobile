import React, { useEffect } from 'react';
import { Picker, View, StyleSheet } from 'react-native';
import { Caption, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { fetchAccounts, setActiveAccount } from '../actions/accounts';
import Loading from './Loading';
import i18n, { ACCOUNT_PICKER_MESSAGE, NO_ACCOUNTS_MESSAGE } from '../lib/i18n';

const styles = StyleSheet.create({
  root: {
    padding: 10,
    flexGrow: 3,
    alignContent: 'flex-start',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
  },
  picker: {
    width: '100%',
    backgroundColor: '#e2e3e2',
  },
  loader: {
    marginTop: 15,
    alignSelf: 'center',
  },
  inlineLoader: {
    alignSelf: 'center',
    marginLeft: 15,
  },
  noOptionsMessage: {
    alignSelf: 'center',
    marginTop: 30,
  },
});

const AccountPicker = () => {
  const dispatch = useDispatch();

  const { active: activeAccountId, value: accounts, isLoading } = useSelector(state => state.accounts);
  const activeAccount = accounts.find(account => account.accountId === activeAccountId);
  const userId = useSelector(state => state.auth.id);
  
  useEffect(() => {
    dispatch(fetchAccounts(userId));
  });


  if (!accounts || !accounts.length) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(ACCOUNT_PICKER_MESSAGE)}:</Title>
        {isLoading
          ? <Loading style={styles.inlineLoader} />
          : <Caption style={styles.noOptionsMessage}>{i18n.t(NO_ACCOUNTS_MESSAGE)}</Caption>
        }
      </View>
    );
  }

  if (!activeAccount) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(ACCOUNT_PICKER_MESSAGE)}:</Title>
        <Loading style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.titleGroup}>
        <Title>{i18n.t(ACCOUNT_PICKER_MESSAGE)}:</Title>
        {isLoading ? <Loading style={styles.inlineLoader} /> : null}
      </View>

      <Picker
        selectedValue={activeAccount.accountId}
        style={styles.picker}
        onValueChange={itemValue => dispatch(setActiveAccount(itemValue))}
      >
        {accounts.map(account => (
          <Picker.Item key={account.accountId} label={account.accountName} value={account.accountId} />
        ))}
      </Picker>
    </View>
  );
};

export default AccountPicker;
