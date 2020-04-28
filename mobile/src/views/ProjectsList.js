import React, { useEffect, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Paragraph } from 'react-native-paper';

import { PROJECT_HOME_ROUTE } from '../constants';
import i18n, { NO_PROJECTS_FOUND_MESSAGE, LOADING_MESSAGE } from '../lib/i18n';
import { fetchProjects, setActiveProject } from '../actions/projects';
import ProjectsListItem from '../components/ProjectsListItem';

const styles = StyleSheet.create({
  empty: {
    padding: 10,
    alignSelf: 'center',
  },
});

const ProjectsList = ({ navigation }) => {
  const { accounts: projectAccounts } = useSelector(state => state.projects);
  const { active: activeAccountId, value: accounts } = useSelector(state => state.accounts);
  const dispatch = useDispatch();

  const activeAccount = accounts.find(account => account.accountId === activeAccountId);
  const projects = projectAccounts[activeAccount.accountName]?.projects;
  const isLoading = projectAccounts[activeAccount.accountName]?.isLoading || false;

  const refresh = useCallback(() => {
    dispatch(fetchProjects(activeAccount.accountName));
  }, [activeAccount.accountName]);

  useEffect(() => {
    if (!projects || !projects.length) {
      refresh();
    }
  }, []);

  return (
    <FlatList
      data={projects}
      onRefresh={refresh}
      refreshing={isLoading}
      ItemSeparatorComponent={() => <Divider />}
      initialNumToRender={12}
      ListEmptyComponent={() => <Paragraph style={styles.empty}>{i18n.t(isLoading ? LOADING_MESSAGE : NO_PROJECTS_FOUND_MESSAGE)}</Paragraph>}
      renderItem={({ item }) => (
        <ProjectsListItem
          key={item.id}
          name={item.name}
          description={item.description}
          visibility={item.core.visibility}
          onPress={() => {
            dispatch(setActiveProject(item.id));
            navigation.navigate(PROJECT_HOME_ROUTE, { title: item.name });
          }}
        />
      )}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ProjectsList;
