import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Caption, DataTable } from 'react-native-paper';

import Loading from './Loading';
import i18n, {
  WORK_ITEM_ID_HEADING,
  WORK_ITEM_TITLE_HEADING,
  WORK_ITEM_TYPE_HEADING,
  WORK_ITEM_ASSIGNEE_HEADING,
  WORK_ITEM_STATUS_HEADING,
  LOADING_MESSAGE,
  NO_WORK_ITEMS_MESSAGE,
  UNASSIGNED_MESSAGE,
} from '../lib/i18n';

const styles = StyleSheet.create({
  table: {
    flex: 1,
  },
  tableBody: {
    borderTopColor: '#D2D2D2',
    borderTopWidth: 1,
    borderBottomColor: '#D2D2D2',
    borderBottomWidth: 1,
  },
  wideRow: {
    flexGrow: 4,
  },
  mediumRow: {
    flexGrow: 2,
  },
  narrowRow: {
    flexGrow: 1,
  },
  message: {
    alignSelf: 'center',
  },
});

const WorkItemsList = ({ workItems, isLoading, onRowPress = () => {} }) => {
  if (!workItems || !workItems.length) {
    return (
      <React.Fragment>
        {isLoading ? <Loading style={styles.message} /> : null}
        <Caption style={styles.message}>{isLoading ? i18n.t(LOADING_MESSAGE) : i18n.t(NO_WORK_ITEMS_MESSAGE)}</Caption>
      </React.Fragment>
    );
  }

  const [page, setPage] = useState(0);
  useEffect(() => setPage(0), [workItems]);

  const PAGE_SIZE = 50;
  const pageItems = workItems.slice(page * PAGE_SIZE, (page * PAGE_SIZE) + PAGE_SIZE);
  const paginationLabel = `${page * PAGE_SIZE + 1}-${Math.min(workItems.length, (page + 1) * PAGE_SIZE)} of ${workItems.length}`;

  return (
    <React.Fragment>
      {isLoading ? <Loading style={styles.message} /> : null}

      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title style={styles.narrowRow}>{i18n.t(WORK_ITEM_ID_HEADING)}</DataTable.Title>
          <DataTable.Title style={styles.wideRow}>{i18n.t(WORK_ITEM_TITLE_HEADING)}</DataTable.Title>
          <DataTable.Title style={styles.mediumRow}>{i18n.t(WORK_ITEM_TYPE_HEADING)}</DataTable.Title>
          <DataTable.Title style={styles.mediumRow}>{i18n.t(WORK_ITEM_ASSIGNEE_HEADING)}</DataTable.Title>
          <DataTable.Title style={styles.narrowRow}>{i18n.t(WORK_ITEM_STATUS_HEADING)}</DataTable.Title>
        </DataTable.Header>

        <ScrollView style={styles.tableBody}>
          {(pageItems || []).map(item => {
            if (!item) return null;
            return (
              <DataTable.Row key={item.id} onPress={() => onRowPress(item)}>
                <DataTable.Cell style={styles.narrowRow}>{item.id}</DataTable.Cell>
                <DataTable.Cell style={styles.wideRow}>{item.fields['System.Title']}</DataTable.Cell>
                <DataTable.Cell style={styles.mediumRow}>{item.fields['System.WorkItemType']}</DataTable.Cell>
                <DataTable.Cell style={styles.mediumRow}>{item.fields['System.AssignedTo']?.displayName || i18n.t(UNASSIGNED_MESSAGE)}</DataTable.Cell>
                <DataTable.Cell style={styles.narrowRow}>{item.fields['System.State']}</DataTable.Cell>
              </DataTable.Row>
            );
          })}
        </ScrollView>

        <DataTable.Pagination

          page={page}
          numberOfPages={Math.ceil(workItems.length / PAGE_SIZE)}
          onPageChange={(page) => { if (page >= 0) setPage(page) }}
          label={paginationLabel}
        />
      </DataTable>
    </React.Fragment>
  );
};

export default WorkItemsList;
