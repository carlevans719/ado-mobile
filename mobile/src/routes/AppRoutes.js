// @ts-check

import React, { useRef, useEffect, useState } from 'react';
import { Animated, View, Text, ScrollView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';  
import { withTheme, Divider, TouchableRipple, Avatar, Subheading, Caption, Title, List } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import {
  ACCOUNTS_LIST_ROUTE,
  PROJECT_HOME_ROUTE,
  PROJECTS_LIST_ROUTE,
  SETTINGS_ROUTE,
} from '../constants';
import i18n, {
  ACCOUNTS_LIST_NAVTEXT,
  PROJECTS_LIST_NAVTEXT,
  PROJECT_HOME_NAVTEXT,
  SETTINGS_NAVTEXT,
} from "../lib/i18n";
import { logout } from '../actions/auth';
import AccountsList from "../views/AccountsList";
import ProjectsList from '../views/ProjectsList';
import Settings from '../views/Settings';
import ProjectHome from '../views/project/Home';
import ProjectBacklogs from '../views/project/Backlogs';
import ProjectIterations from '../views/project/Iterations';
import WorkItem from '../views/project/WorkItem';
import Search from '../views/Search';
import AccountPicker from '../components/AccountPicker';
import ProjectPicker from '../components/ProjectPicker';
import { getActiveProject } from '../lib/projectUtils';
import SlideView from '../components/SlideView';
import MenuStack from '../components/MenuStack';

const USER_PLACEHOLDER = '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';

const styles = StyleSheet.create({
  drawerRoot: {
    flex: 1,
  },
  drawerHeaderRoot: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 40,
    backgroundColor: 'lightblue',
  },
  drawerHeaderAvatar: {
    margin: 20,
  },
  drawerMenu: {
    // backgroundColor: 'grey',
    flexGrow: 1,
  },
  drawerRow: {
    padding: 10,
  },
  drawerRowIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerFooterRoot: {
    backgroundColor: 'lightblue',
  },
  mainMenu: {},
});

const DrawerHeader = () => {
  const { user } = useSelector(state => state.auth);
  console.log(user)
  const profile = {
    name: user.coreAttributes.DisplayName.value,
    email: user.coreAttributes.EmailAddress.value.toLowerCase(),
    avatar: `data:image/png;base64,${user.coreAttributes.Avatar?.value?.value || USER_PLACEHOLDER}`,
  }

  return (
    <View style={styles.drawerHeaderRoot}>
      <Avatar.Image style={styles.drawerHeaderAvatar} source={{ uri: profile.avatar }} size={100} />
      <Title>Hi {profile.name}</Title>
      <Caption>{profile.email}</Caption>
    </View>
  );
};

const MainMenu = React.forwardRef((props, ref) => {
  return (
    <SlideView ref={ref}>
      <List.Section {...props}>
        <List.Item
          onPress={() => { props.menuStackRef.push('accounts') }}
          style={styles.drawerRow}
          title="Organisations"
          left={() => <View style={styles.drawerRowIcon}><MaterialIcons size={20} name="business" /></View>}
          right={() => <View style={styles.drawerRowIcon}><MaterialIcons size={20} name="chevron-right" /></View>}
        />
      </List.Section>

    </SlideView>
  );
});

const AccountsMenu = React.forwardRef((props, ref) => {
  return (
    <SlideView ref={ref}>
      <List.Section {...props}>
        <List.Item
          onPress={() => { props.menuStackRef.pop() }}
          style={styles.drawerRow}
          title="Organisation 1"
          left={() => <View style={styles.drawerRowIcon}><MaterialIcons size={20} name="business" /></View>}
          // right={() => <View style={styles.drawerRowIcon}><MaterialIcons size={20} name="chevron-right" /></View>}
        />
      </List.Section>

    </SlideView>
  );
});

const DrawerFooter = () => {
  const dispatch = useDispatch();

  return (
    <View style={styles.drawerFooterRoot}>
      <Divider />
      <List.Item
        onPress={() => dispatch(logout())}
        style={styles.drawerRow}
        title="Logout"
        left={() => <View style={styles.drawerRowIcon}><MaterialCommunityIcons size={20} name="logout" /></View>}
      />
    </View>
  );
};

const DrawerContent = () => {
  return (
    <View style={styles.drawerRoot}>
      <DrawerHeader />

      <ScrollView style={styles.drawerMenu}>
        <MenuStack
          initialComponentName="main"
          items={[
            { Component: MainMenu, name: 'main', props: {} },
            { Component: AccountsMenu, name: 'accounts', props: {} },
          ]}
        />
      </ScrollView>

      <DrawerFooter />
    </View>
  );
};

// Root drawer router
const RootDrawer = createDrawerNavigator();
const RootRouter = () => {
  const activeProject = getActiveProject(useSelector(state => state.projects));
  const ref = useRef(null);
  
  return (
    <RootDrawer.Navigator drawerContent={props => <DrawerContent />} >
      {/* Account Picker */}
      <RootDrawer.Screen name={ACCOUNTS_LIST_ROUTE} component={AccountsList} options={{ title: i18n.t(ACCOUNTS_LIST_NAVTEXT) }} />

      {/* Project Picker */}
      <RootDrawer.Screen name={PROJECTS_LIST_ROUTE} component={ProjectsList} options={{ title: i18n.t(PROJECTS_LIST_NAVTEXT) }} />

      {activeProject
        ? [
          // {/* Project Home */}
          <RootDrawer.Screen  name={PROJECT_HOME_ROUTE} component={ProjectHome} options={{ title: i18n.t(PROJECT_HOME_NAVTEXT), group: activeProject.name }} />,
    
          // {/* Project Search */}
          // {/* <RootDrawer.Screen name={} component={} />, */}
    
          // {/* Project Backlogs */}
          // <RootDrawer.Screen name={PROJECT_BACKLOGS_ROUTER} component={ProjectBacklogRoutes} options={{ title: i18n.t(PROJECT_BACKLOGS_NAVTEXT), group: activeProject.name }} />,
    
          // // {/* Project Iterationss */}
          // <RootDrawer.Screen name={PROJECT_ITERATIONS_ROUTER} component={ProjectIterationRoutes} options={{ title: i18n.t(PROJECT_ITERATIONS_NAVTEXT), group: activeProject.name }} />,
        ]
        : null
      }

      {/* Settings */}
      <RootDrawer.Screen name={SETTINGS_ROUTE} component={Settings} options={{ title: i18n.t(SETTINGS_NAVTEXT), drawerIcon: () => <MaterialIcons name="settings" />, drawerItemStyle: { justifySelf: 'flex-end' } }} />
    </RootDrawer.Navigator>
  );
};

export default RootRouter;
