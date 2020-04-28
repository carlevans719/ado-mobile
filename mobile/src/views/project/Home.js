import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Caption, Title, Surface, Text } from 'react-native-paper';

import Markdown from '../../components/Markdown';
import i18n, {
  PROJECT_HOME_TITLE,
  PROJECT_HOME_OVERVIEW_TITLE,
  PROJECT_HOME_NO_CONTENT_MESSAGE,
  PROJECT_HOME_NO_DESCRIPTION_MESSAGE,
} from '../../lib/i18n';
import { fetchProjectConfig, fetchProjectAbout } from '../../actions/projects/about';
import { setHasLoadedAProjectBefore } from '../../actions/projects';
import { getActiveProject } from '../../lib/projectUtils';

const styles = StyleSheet.create({
  root: {
    marginTop: 20,
  },
  title: {
    textDecorationLine: 'underline',
    margin: 10,
    marginBottom: 20,
  },
  surface: {
    margin: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const projects = useSelector(state => state.projects);
  const { hasLoadedAProjectBefore } = projects;
  const activeProject = getActiveProject(projects);
  if (!activeProject) {
    navigation.goBack();
    return null;
  }

  const { id: projectId, accountName, about, isLoadingConfig, isLoadingAbout } = activeProject;

  const refresh = () => {
    dispatch(fetchProjectConfig(accountName, projectId))
      .then(res => dispatch(fetchProjectAbout(
        accountName,
        projectId,
        res.payload.config.about.repositoryId,
        res.payload.config.about.sourceRepositoryType,
      )));
  };

  useEffect(() => {
    if (!about || !about.content) {
      refresh();
    }

    if (!hasLoadedAProjectBefore) {
      navigation.openDrawer();
      setTimeout(() => navigation.closeDrawer(), 700);
      dispatch(setHasLoadedAProjectBefore(true));
    }
  }, []);

  const md = useMemo(() => <Markdown content={about?.content} />, [about?.content]);

  return (
    <ScrollView style={styles.root} refreshControl={<RefreshControl refreshing={isLoadingConfig || isLoadingAbout} onRefresh={refresh} />}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>{i18n.t(PROJECT_HOME_TITLE)}</Title>
        {activeProject.description
          ? <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 16 }}>{activeProject.description}</Text>
          : <Caption>{i18n.t(PROJECT_HOME_NO_DESCRIPTION_MESSAGE)}</Caption>
        }
      </Surface>

      <Surface style={styles.surface}>
        <Title style={styles.title}>{i18n.t(PROJECT_HOME_OVERVIEW_TITLE)}</Title>
        {about?.content
          ? md
          : <Caption>{i18n.t(PROJECT_HOME_NO_CONTENT_MESSAGE)}</Caption>
        }
      </Surface>
    </ScrollView>
  );
};

export default Home;
