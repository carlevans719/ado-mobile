import { httpFetch } from '../../lib/http';

export const FETCH_PROJECTS = 'fetchProjects';
export const fetchProjects = (accountName) => async (dispatch) => {
  dispatch(requestProjects(accountName));

  return httpFetch(`https://dev.azure.com/${accountName}/_apis/projects?api-version=5.1`)
    .then(projectData => dispatch(receiveProjects(accountName, projectData)));
};

export const SET_ACTIVE_PROJECT = 'setActiveProject';
export const setActiveProject = (projectId) => ({
  type: SET_ACTIVE_PROJECT,
  payload: projectId,
});

export const REQUEST_PROJECTS = 'requestProjects';
export const requestProjects = (accountName) => ({
  type: REQUEST_PROJECTS,
  payload: accountName,
});

export const RECEIVE_PROJECTS = 'receiveProjects';
export const receiveProjects = (accountName, payload) => ({
  type: RECEIVE_PROJECTS,
  payload: {
    accountName,
    projects: payload.value,
  },
});

export const SET_HAS_LOADED_A_PROJECT_BEFORE = 'setHasLoadedAProjectBefore';
export const setHasLoadedAProjectBefore = (payload) => ({
  type: SET_HAS_LOADED_A_PROJECT_BEFORE,
  payload,
});
