import { httpFetch } from '../../lib/http';
import { makeChunks } from '../../lib/array';

export const FETCH_PROJECT_TEAMS = 'fetchProjectTeams';
export const fetchProjectTeams = (accountName, projectId) => async dispatch => {
  dispatch(requestProjectTeams(accountName, projectId));

  return httpFetch(`https://dev.azure.com/${accountName}/_apis/projects/${projectId}/teams?api-version=5.1`)
    .then(projectTeams => {
      // console.log('Project Teams: ', projectTeams);
      return dispatch(receiveProjectTeams(projectId, projectTeams));
    });
};

export const REQUEST_PROJECT_TEAMS = 'requestProjectTeams';
export const requestProjectTeams = (projectId) => ({
  type: REQUEST_PROJECT_TEAMS,
  payload: projectId,
});

export const RECEIVE_PROJECT_TEAMS = 'receiveProjectTeams';
export const receiveProjectTeams = ( projectId, payload) => {
  return {
  type: RECEIVE_PROJECT_TEAMS,
  payload: {
    projectId,
    teams: payload.value,
  },
}};

export const SET_ACTIVE_TEAM = 'setActiveTeam';
export const setActiveTeam = (projectId, teamId) => ({
  type: SET_ACTIVE_TEAM,
  payload: {
    projectId,
    teamId,
  },
});

export const FETCH_PROJECT_BACKLOGS = 'fetchProjectBacklogs';
export const fetchProjectBacklogs = (accountName, projectId, teamId) => async dispatch => {
  dispatch(requestProjectBacklogs(projectId, teamId));

  return httpFetch(`https://dev.azure.com/${accountName}/${projectId}/${teamId}/_apis/work/backlogs?api-version=5.1-preview.1`)
    .then(projectBacklogs => {
      // console.log('Project Backlogs: ', projectBacklogs);
      return dispatch(receiveProjectBacklogs(projectId, teamId, projectBacklogs.value));
    });
};

export const REQUEST_PROJECT_BACKLOGS = 'requestProjectBacklogs';
export const requestProjectBacklogs = (projectId, teamId) => ({
  type: REQUEST_PROJECT_BACKLOGS,
  payload: {
    projectId,
    teamId,
  },
});

export const RECEIVE_PROJECT_BACKLOGS = 'receiveProjectBacklogs';
export const receiveProjectBacklogs = (projectId, teamId, payload) => ({
  type: RECEIVE_PROJECT_BACKLOGS,
  payload: {
    projectId,
    teamId,
    backlogs: payload,
  },
});

export const SET_ACTIVE_BACKLOG = 'setActiveBacklog';
export const setActiveBacklog = (projectId, teamId, backlogId) => ({
  type: SET_ACTIVE_BACKLOG,
  payload: {
    projectId,
    teamId,
    backlogId,
  },
});

export const FETCH_BACKLOG_WORK_ITEMS = 'fetchBacklogWorkItems';
export const fetchBacklogWorkItems = (accountName, projectId, teamId, backlogId) => async dispatch => {
  dispatch(requestBacklogWorkItems(projectId, teamId, backlogId));

  return httpFetch(`https://dev.azure.com/${accountName}/${projectId}/${teamId}/_apis/work/backlogs/${backlogId}/workItems?api-version=5.1-preview.1`)
    .then(res => {
      if (!res?.workItems?.length) {
        return Promise.resolve([{value: []}]);
      }

      const chunks = makeChunks(res.workItems.map(workItem => workItem.target.id));
      return Promise.all(chunks.map(chunk => httpFetch(`https://dev.azure.com/${accountName}/${projectId}/_apis/wit/workitemsbatch?api-version=5.1`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // $expand: 'None|Relations|Fields|Links|All',
          // asOf: (new Date()).toISOString(),
          errorPolicy: 'Omit', // or 'Fail'
          // fields: [],
          ids: chunk,
        }),
      })));
    })
    .then(res => {
      dispatch(receiveBacklogWorkItems(projectId, teamId, backlogId, res.reduce((p, c) => p.concat(c.value), [])))
    })
    .catch(err => {
      // console.warn(err.message)
    });
};

export const REQUEST_BACKLOG_WORK_ITEMS = 'requestBacklogWorkItems';
export const requestBacklogWorkItems = (projectId, teamId, backlogId) => ({
  type: REQUEST_BACKLOG_WORK_ITEMS,
  payload: {
    projectId,
    teamId,
    backlogId,
  },
});

export const RECEIVE_BACKLOG_WORK_ITEMS = 'receiveBacklogWorkItems';
export const receiveBacklogWorkItems = (projectId, teamId, backlogId, payload) => ({
  type: RECEIVE_BACKLOG_WORK_ITEMS,
  payload: {
    projectId,
    teamId,
    backlogId,
    items: payload,
  },
});