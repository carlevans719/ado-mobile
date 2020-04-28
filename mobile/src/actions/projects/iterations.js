import { httpFetch } from '../../lib/http';
import { makeChunks } from '../../lib/array';

export const FETCH_PROJECT_ITERATIONS = 'fetchProjectIterations';
export const fetchProjectIterations = (accountName, projectId, teamId) => async dispatch => { 
  dispatch(requestProjectIterations(projectId, teamId));

  return httpFetch(`https://dev.azure.com/${accountName}/${projectId}/${teamId}/_apis/work/teamsettings/iterations?api-version=5.1-preview.1`)
    .then(projectIterations => {
      // console.log('Project Iterations: ', projectIterations);
      return dispatch(receiveProjectIterations(projectId, teamId, projectIterations.value));
    });
};

export const REQUEST_PROJECT_ITERATIONS = 'requestProjectIterations';
export const requestProjectIterations = (projectId, teamId) => ({
  type: REQUEST_PROJECT_ITERATIONS,
  payload: {
    projectId,
    teamId,
  },
});

export const RECEIVE_PROJECT_ITERATIONS = 'receiveProjectIterations';
export const receiveProjectIterations = (projectId, teamId, payload) => ({
  type: RECEIVE_PROJECT_ITERATIONS,
  payload: {
    projectId,
    teamId,
    iterations: payload,
  },
});

export const SET_ACTIVE_ITERATION = 'setActiveIteration';
export const setActiveIteration = (projectId, teamId, iterationId) => ({
  type: SET_ACTIVE_ITERATION,
  payload: {
    projectId,
    teamId,
    iterationId,
  },
});

export const FETCH_ITERATION_WORK_ITEMS = 'fetchIterationWorkItems';
export const fetchIterationWorkItems = (accountName, projectId, teamId, iterationId) => async dispatch => {
  dispatch(requestIterationWorkItems(projectId, teamId, iterationId));

  return httpFetch(`https://dev.azure.com/${accountName}/${projectId}/${teamId}/_apis/work/teamsettings/iterations/${iterationId}/workItems?api-version=5.1-preview.1`)
    .then(res => {
      if (!res?.workItemRelations?.length) {
        return Promise.resolve([{value: []}]);
      }

      const chunks = makeChunks(res.workItemRelations.map(workItem => workItem.target.id));
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
      dispatch(receiveIterationWorkItems(projectId, teamId, iterationId, res.reduce((p, c) => p.concat(c.value), [])))
    })
    .catch(err => {
      // console.warn(err.message)
    });
};

export const REQUEST_ITERATION_WORK_ITEMS = 'requestIterationWorkItems';
export const requestIterationWorkItems = (projectId, teamId, iterationId) => ({
  type: REQUEST_ITERATION_WORK_ITEMS,
  payload: {
    projectId,
    teamId,
    iterationId,
  },
});

export const RECEIVE_ITERATION_WORK_ITEMS = 'receiveIterationWorkItems';
export const receiveIterationWorkItems = (projectId, teamId, iterationId, payload) => ({
  type: RECEIVE_ITERATION_WORK_ITEMS,
  payload: {
    projectId,
    teamId,
    iterationId,
    items: payload,
  },
});