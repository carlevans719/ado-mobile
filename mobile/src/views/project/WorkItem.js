import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Headline, Text, Caption, Surface } from 'react-native-paper';
import { WebView } from 'react-native-webview';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 10,
  },
  webview: {
    width: '100%',
    height: 100,
    backgroundColor: '#E2E3E2',
  },
  surface: {
    margin: 10,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    elevation: 4,
  },
  tags: {
    flexDirection: 'row',
    maxWidth: '100%',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
});

const WorkItem = ({ route }) => {
  const tags = route.params.item.fields['System.Tags']?.split('; ') || [];
  return (
    <ScrollView style={styles.root}>
      <Headline>{route.params.item.fields['System.Title']}</Headline>
      <View style={styles.tags}>
        {tags.map(tag => <Chip key={tag}>{tag}</Chip>)}
      </View>

      <Surface style={styles.surface}>
        <Text>ID: <Caption>{route.params.item.id}</Caption></Text>
        <Text>Type: <Caption>{route.params.item.fields['System.WorkItemType']}</Caption></Text>
      </Surface>


      <Surface style={styles.surface}>
        <Text>Description:</Text>
        <WebView textZoom={200} containerStyle={styles.webview} source={{ html: route.params.item.fields['System.Description'] }} originWhitelist={["*"]} />
      </Surface>

      <Surface style={styles.surface}>
        <Text>State: <Caption>{route.params.item.fields['System.State']}</Caption></Text>
        <Text>Assigned To: <Image source={{ uri: route.params.item.fields['System.AssignedTo']?.imageUrl }} /> {route.params.item.fields['System.AssignedTo']?.displayName}</Text>
      </Surface>

      <Surface style={styles.surface}>
        <Text>Priority: <Caption>{route.params.item.fields['Microsoft.VSTS.Common.Priority']}</Caption></Text>
        <Text>Value Area: <Caption>{route.params.item.fields['Microsoft.VSTS.Common.ValueArea']}</Caption></Text>
        <Text>Area Path: <Caption>{route.params.item.fields['System.AreaPath']}</Caption></Text>
        <Text>Iteration: <Caption>{route.params.item.fields['System.IterationPath']}</Caption></Text>
      </Surface>


      {/* <Text>Changed By: <Image source={{ uri: route.params.item.fields['System.ChangedBy'].imageUrl }} /> {route.params.item.fields['System.ChangedBy']?.displayName}</Text>
      <Text>Changed On: {route.params.item.fields['System.ChangedDate']}</Text>
      <Text>Created By: <Image source={{ uri: route.params.item.fields['System.CreatedBy'].imageUrl }} /> {route.params.item.fields['System.CreatedBy']?.displayName}</Text>
      <Text>Created On: {route.params.item.fields['System.CreatedDate']}</Text> */}
    </ScrollView>
  )
};

export default WorkItem;
