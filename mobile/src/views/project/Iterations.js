import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Title } from 'react-native-paper';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import IterationPicker from '../../components/IterationPicker';
import TeamPicker from '../../components/TeamPicker';
import { fetchIterationWorkItems } from '../../actions/projects/iterations';
import { getActiveProject, getActiveTeam } from '../../lib/projectUtils';
import WorkItemsList from '../../components/WorkItemsList';
import i18n, { WORK_ITEMS_TITLE } from '../../lib/i18n';
import { PROJECT_ITERATIONS_WORK_ITEM_ROUTE } from '../../constants';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'flex-start',
    padding: 10,
  },
  pickerGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 4,
    marginBottom: 20,
  },
  tableWrapper: {
    flex: 1,
    width: '100%',
    padding: 10,
    elevation: 4,
  },
});

const Iterations = ({ navigation }) => {
  const dispatch = useDispatch();
  const projectState = useSelector(state => state.projects);

  // TODO: getActiveProject helper refactor to look like the below - extract the below into the helpers too
  
  const activeIteration = useSelector(state => {
    for (const key in state.projects.accounts) {
      for (const project of state.projects.accounts[key].projects) {
        if (project.isActive) {
          for (const team of project.teams) {
            if (team.isActive) {
              for (const iteration of team.iterations || []) {
                if (iteration.isActive) {
                  return iteration;
                }
              }
            }
          }
        }
      }
    }
  }, shallowEqual);

  const [isLoading, setIsLoading] = useState(activeIteration ? activeIteration.isLoadingItems : true);
  const workItems = useSelector(state => {
    for (const key in state.projects.accounts) {
      for (const project of state.projects.accounts[key].projects) {
        if (project.isActive) {
          for (const team of project.teams) {
            if (team.isActive) {
              for (const iteration of team.iterations || []) {
                if (iteration.isActive) {
                  if (isLoading !== iteration.isLoadingItems) setIsLoading(iteration.isLoadingItems);
                  return iteration.items;
                }
              }
            }
          }
        }
      }
    }
  }, shallowEqual);

  const { activeProject, activeTeam } = (() => {
    let _activeProject = getActiveProject(projectState);
    let _activeTeam;
    try { _activeTeam = getActiveTeam(projectState, _activeProject.id); } catch (e) {}

    return {
      activeProject: _activeProject,
      activeTeam: _activeTeam,
    };
  })();

  useEffect(() => {
    if (activeProject && activeTeam && activeIteration) {
      dispatch(fetchIterationWorkItems(activeProject.accountName, activeProject.id, activeTeam.id, activeIteration.id));
    }
  }, [activeProject?.id, activeTeam?.id, activeIteration?.id]);

  return (
    <View style={styles.root}>

      <Surface style={styles.pickerGroup}>
        <TeamPicker />
        <IterationPicker />
      </Surface>

      <Surface style={styles.tableWrapper}>
        <Title>{i18n.t(WORK_ITEMS_TITLE)}</Title>
        <WorkItemsList workItems={workItems} isLoading={isLoading} onRowPress={item => navigation.navigate(PROJECT_ITERATIONS_WORK_ITEM_ROUTE, { item })} />
      </Surface>
      
    </View>
  );
};

export default Iterations;
