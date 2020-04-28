import React, { useCallback, useEffect } from 'react';
import { Picker, View, StyleSheet } from 'react-native';
import { Caption, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getActiveProject, getActiveTeam } from '../lib/projectUtils';
import { fetchProjectTeams, setActiveTeam } from '../actions/projects/backlogs';
import Loading from './Loading';
import i18n, { TEAM_PICKER_MESSAGE, NO_TEAMS_MESSAGE } from '../lib/i18n';

const styles = StyleSheet.create({
  root: {
    padding: 10,
    flexGrow: 2,
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

const TeamPicker = () => {
  const dispatch = useDispatch();

  const projectState = useSelector(state => state.projects);
  const activeProject = getActiveProject(projectState);
  const activeTeam = getActiveTeam(projectState, activeProject.id);

  const refresh = useCallback(() => {
    if (activeProject) {
      dispatch(fetchProjectTeams(activeProject.accountName, activeProject.id))
    }
  }, [activeProject?.id]);

  useEffect(refresh, []);

  if (!activeProject) {
    return (
      <View style={styles.root}>
        <Picker style={styles.picker} />
      </View>
    );
  }
  
  const { teams, isLoadingTeams } = activeProject;

  if (!teams || !teams.length) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(TEAM_PICKER_MESSAGE)}:</Title>
        {isLoadingTeams
          ? <Loading style={styles.inlineLoader} />
          : <Caption style={styles.noOptionsMessage}>{i18n.t(NO_TEAMS_MESSAGE)}</Caption>
        }
      </View>
    );
  }

  if (!activeTeam) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(TEAM_PICKER_MESSAGE)}:</Title>
        <Loading style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.titleGroup}>
        <Title>{i18n.t(TEAM_PICKER_MESSAGE)}:</Title>
        {isLoadingTeams ? <Loading style={styles.inlineLoader} /> : null}
      </View>

      <Picker
        selectedValue={activeTeam.id}
        style={styles.picker}
        onValueChange={itemValue => dispatch(setActiveTeam(activeProject.id, itemValue))}
      >
        {teams.map(team => (
          <Picker.Item key={team.id} label={team.name} value={team.id} />
        ))}
      </Picker>
    </View>
  );
};

export default TeamPicker;
