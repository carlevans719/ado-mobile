import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Title } from 'react-native-paper';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

// for work item component
// import { WebView } from 'react-native-webview';
// <WebView source={{ uri: 'https://reactnative.dev/' }} />;

import BacklogPicker from '../../components/BacklogPicker';
import TeamPicker from '../../components/TeamPicker';
import { fetchBacklogWorkItems } from '../../actions/projects/backlogs';
import { getActiveProject, getActiveTeam } from '../../lib/projectUtils';
import WorkItemsList from '../../components/WorkItemsList';
import i18n, { WORK_ITEMS_TITLE } from '../../lib/i18n';
import { PROJECT_BACKLOGS_WORK_ITEM_ROUTE } from '../../constants';

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

const Backlogs = ({ navigation }) => {
  const dispatch = useDispatch();
  const projectState = useSelector(state => state.projects);

  // TODO: getActiveProject helper refactor to look like the below - extract the below into the helpers too
  
  const activeBacklog = useSelector(state => {
    for (const key in state.projects.accounts) {
      for (const project of state.projects.accounts[key].projects) {
        if (project.isActive) {
          for (const team of project.teams) {
            if (team.isActive) {
              for (const backlog of team.backlogs) {
                if (backlog.isActive) {
                  return backlog;
                }
              }
            }
          }
        }
      }
    }
  }, shallowEqual);

  const [isLoading, setIsLoading] = useState(activeBacklog ? activeBacklog.isLoadingItems : true);
  const workItems = useSelector(state => {
    for (const key in state.projects.accounts) {
      for (const project of state.projects.accounts[key].projects) {
        if (project.isActive) {
          for (const team of project.teams) {
            if (team.isActive) {
              for (const backlog of team.backlogs) {
                if (backlog.isActive) {
                  if (isLoading !== backlog.isLoadingItems) setIsLoading(backlog.isLoadingItems);
                  return backlog.items;
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
    if (activeProject && activeTeam && activeBacklog) {
      dispatch(fetchBacklogWorkItems(activeProject.accountName, activeProject.id, activeTeam.id, activeBacklog.id));
    }
  }, [activeProject?.id, activeTeam?.id, activeBacklog?.id]);

  return (
    <View style={styles.root}>

      <Surface style={styles.pickerGroup}>
        <TeamPicker />
        <BacklogPicker />
      </Surface>

      <Surface style={styles.tableWrapper}>
        <Title>{i18n.t(WORK_ITEMS_TITLE)}</Title>
        <WorkItemsList workItems={workItems} isLoading={isLoading} onRowPress={item => navigation.navigate(PROJECT_BACKLOGS_WORK_ITEM_ROUTE, { item })} />
      </Surface>
      
    </View>
  );
};

export default Backlogs;
