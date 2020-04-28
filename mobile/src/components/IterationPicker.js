import React, { useCallback, useEffect } from 'react';
import { Picker, View, StyleSheet } from 'react-native';
import { Caption, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getActiveProject, getActiveTeam, getActiveIteration } from '../lib/projectUtils';
import { fetchProjectIterations, setActiveIteration } from '../actions/projects/iterations';
import Loading from './Loading';
import i18n, { ITERATION_PICKER_MESSAGE, NO_ITERATIONS_MESSAGE } from '../lib/i18n';

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

const IterationPicker = () => {
  const dispatch = useDispatch();

  const projectState = useSelector(state => state.projects);
  const activeProject = getActiveProject(projectState);
  const activeTeam = activeProject ? getActiveTeam(projectState, activeProject.id) : null;

  const refresh = useCallback(() => {
    if (activeProject && activeTeam) {
      dispatch(fetchProjectIterations(activeProject.accountName, activeProject.id, activeTeam.id))
    }
  }, [activeProject?.accountName, activeProject?.id, activeTeam?.id]);

  useEffect(refresh, [activeProject?.id, activeTeam?.id]);

  if (!activeProject || !activeTeam) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(ITERATION_PICKER_MESSAGE)}:</Title>
        <Caption style={styles.noOptionsMessage}>{i18n.t(NO_ITERATIONS_MESSAGE)}</Caption>
      </View>
    );
  }

  const { iterations, isLoadingIterations } = activeTeam;
  const activeIteration = getActiveIteration(projectState, activeProject.id, activeTeam.id);

  if (!iterations || !iterations.length) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(ITERATION_PICKER_MESSAGE)}:</Title>
        {isLoadingIterations
          ? <Loading style={styles.inlineLoader} />
          : <Caption style={styles.noOptionsMessage}>{i18n.t(NO_ITERATIONS_MESSAGE)}</Caption>
        }
      </View>
    );
  }

  if (!activeIteration) {
    return (
      <View style={styles.root}>
        <Title>{i18n.t(ITERATION_PICKER_MESSAGE)}:</Title>
        <Loading style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.titleGroup}>
        <Title>{i18n.t(ITERATION_PICKER_MESSAGE)}:</Title>
        {isLoadingIterations ? <Loading style={styles.inlineLoader} /> : null}
      </View>

      <Picker
        selectedValue={activeIteration.id}
        style={styles.picker}
        onValueChange={itemValue => dispatch(setActiveIteration(activeProject.id, activeTeam.id, itemValue))}
      >
        {iterations.map(iteration => (
          <Picker.Item key={iteration.id} label={iteration.name} value={iteration.id} />
        ))}
      </Picker>
    </View>
  );
};

export default IterationPicker;
