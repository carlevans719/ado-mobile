import React from 'react';
import { Avatar, List, TouchableRipple } from 'react-native-paper';

const ProjectsListItem = ({ name, description = '', visibility, onPress }) => (
  <TouchableRipple onPress={onPress}>
    <List.Item
      style={{ paddingBottom: 10 }}
      title={name}
      description={description}
      left={props => <List.Icon {...props} icon={visibility === 'private' ? 'lock' : 'earth'} />}
    />
  </ TouchableRipple>
);

export default ProjectsListItem;
