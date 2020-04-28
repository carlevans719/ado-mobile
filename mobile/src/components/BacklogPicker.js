import React, { useCallback, useEffect } from 'react';
import { Picker, View, StyleSheet } from 'react-native';
import { Caption, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getActiveProject, getActiveTeam, getActiveBacklog } from '../lib/projectUtils';
import { fetchProjectBacklogs, setActiveBacklog } from '../actions/projects/backlogs';
import Loading from './Loading';
import i18n, { BACKLOG_PICKER_MESSAGE, NO_BACKLOGS_MESSAGE } from '../lib/i18n';

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

const BacklogPicker = () => {
  const dispatch = useDispatch();

  const projectState = useSelector(state => state.projects);
  const activeProject = getActiveProject(projectState);
  const activeTeam = activeProject ? getActiveTeam(projectState, activeProject.id) : null;

  const refresh = useCallback(() => {
    if (activeProject && activeTeam) {
      dispatch(fetchProjectBacklogs(activeProject.accountName, activeProject.id, activeTeam.id))
    }
  }, [activeProject?.accountName, activeProject?.id, activeTeam?.id]);

  useEffect(refresh, [activeProject?.id, activeTeam?.id]);

  if (!activeProject || !activeTeam) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(BACKLOG_PICKER_MESSAGE)}:</Title>
        <Caption style={styles.noOptionsMessage}>{i18n.t(NO_BACKLOGS_MESSAGE)}</Caption>
      </View>
    );
  }

  const { backlogs, isLoadingBacklogs } = activeTeam;
  const activeBacklog = getActiveBacklog(projectState, activeProject.id, activeTeam.id);

  if (!backlogs || !backlogs.length) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(BACKLOG_PICKER_MESSAGE)}:</Title>
        {isLoadingBacklogs
          ? <Loading style={styles.inlineLoader} />
          : <Caption style={styles.noOptionsMessage}>{i18n.t(NO_BACKLOGS_MESSAGE)}</Caption>
        }
      </View>
    );
  }

  if (!activeBacklog) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(BACKLOG_PICKER_MESSAGE)}:</Title>
        <Loading style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.titleGroup}>
        <Title>{i18n.t(BACKLOG_PICKER_MESSAGE)}:</Title>
        {isLoadingBacklogs ? <Loading style={styles.inlineLoader} /> : null}
      </View>

      <Picker
        selectedValue={activeBacklog.id}
        style={styles.picker}
        onValueChange={itemValue => dispatch(setActiveBacklog(activeProject.id, activeTeam.id, itemValue))}
      >
        {backlogs.map(backlog => (
          <Picker.Item key={backlog.id} label={backlog.name} value={backlog.id} />
        ))}
      </Picker>
    </View>
  );
};

export default BacklogPicker;
