import React, { useCallback, useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Paragraph } from 'react-native-paper';

import { PROJECTS_LIST_ROUTE } from '../constants';
import i18n, { NO_ACCOUNTS_FOUND_MESSAGE, LOADING_MESSAGE } from '../lib/i18n';
import { fetchAccounts, setActiveAccount } from '../actions/accounts';
import AccountsListItem from '../components/AccountsListItem';

const styles = StyleSheet.create({
  empty: {
    padding: 10,
    alignSelf: 'center',
  },
});

const AccountsList = ({ navigation }) => {
  const { value: accounts, isLoading } = useSelector(state => state.accounts);
  const id = useSelector(state => state.auth.id);
  const dispatch = useDispatch();
  const refresh = useCallback(() => {
    dispatch(fetchAccounts(id));
  }, [id]);

  useEffect(() => {
    if (!accounts || !accounts.length) {
      refresh();
    }
  }, [id]);

  return (
    <FlatList
      data={accounts}
      onRefresh={refresh}
      refreshing={isLoading}
      ItemSeparatorComponent={() => <Divider />}
      initialNumToRender={12}
      ListEmptyComponent={() => <Paragraph style={styles.empty}>{i18n.t(isLoading ? LOADING_MESSAGE : NO_ACCOUNTS_FOUND_MESSAGE)}</Paragraph>}
      renderItem={({ item }) => (
        <AccountsListItem
          key={item.accountId}
          name={item.accountName}
          onPress={() => {
            dispatch(setActiveAccount(item.accountId));
            navigation.navigate(PROJECTS_LIST_ROUTE, { title: item.accountName });
          }}
        />
      )}
      keyExtractor={(item) => item.accountId}
    />
  );
};

export default AccountsList;
