import React, { useEffect } from 'react';
import { Picker, View, StyleSheet } from 'react-native';
import { Caption, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProjects, setActiveProject } from '../actions/projects';
import Loading from './Loading';
import i18n, { PROJECT_PICKER_MESSAGE, NO_PROJECTS_MESSAGE } from '../lib/i18n';
import { getActiveProject } from '../lib/projectUtils';

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

const ProjectPicker = () => {
  const dispatch = useDispatch();

  const { active: activeAccountId, value: accounts } = useSelector(state => state.accounts);
  const activeAccount = accounts.find(account => account.accountId === activeAccountId);

  const projectsState = useSelector(state => state.projects);
  const activeProject = getActiveProject(projectsState);
  const { projects, isLoading } = projectsState.accounts[activeAccount?.accountName] || {};

  useEffect(() => {
    if (activeAccount) {
      dispatch(fetchProjects(activeAccount.accountName));
    }
  }, [activeAccount]);

  if (!projects || !projects.length) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(PROJECT_PICKER_MESSAGE)}:</Title>
        {isLoading
          ? <Loading style={styles.inlineLoader} />
          : <Caption style={styles.noOptionsMessage}>{i18n.t(NO_PROJECTS_MESSAGE)}</Caption>
        }
      </View>
    );
  }

  if (!activeProject) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(PROJECT_PICKER_MESSAGE)}:</Title>
        <Loading style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.titleGroup}>
        <Title>{i18n.t(PROJECT_PICKER_MESSAGE)}:</Title>
        {isLoading ? <Loading style={styles.inlineLoader} /> : null}
      </View>

      <Picker
        selectedValue={activeProject.id}
        style={styles.picker}
        onValueChange={itemValue => dispatch(setActiveProject(itemValue))}
      >
        {projects.map(project => (
          <Picker.Item key={project.id} label={project.name} value={project.id} />
        ))}
      </Picker>
    </View>
  );
};

export default ProjectPicker;
