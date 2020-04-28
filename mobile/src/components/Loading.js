import React from 'react';
import { ActivityIndicator } from 'react-native';

export default ({ style = [] }) => {
  return (
    <ActivityIndicator style={style} />
  );
};
