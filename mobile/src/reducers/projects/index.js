import {
  REQUEST_PROJECTS,
  RECEIVE_PROJECTS,
  SET_ACTIVE_PROJECT,
  SET_HAS_LOADED_A_PROJECT_BEFORE,
} from '../../actions/projects';
import {
  REQUEST_PROJECT_CONFIG,
  RECEIVE_PROJECT_CONFIG,
  REQUEST_PROJECT_ABOUT,
  RECEIVE_PROJECT_ABOUT,
} from '../../actions/projects/about';

import {
  REQUEST_PROJECT_TEAMS,
  RECEIVE_PROJECT_TEAMS,
  SET_ACTIVE_TEAM,
  REQUEST_PROJECT_BACKLOGS,
  RECEIVE_PROJECT_BACKLOGS,
  SET_ACTIVE_BACKLOG,
  REQUEST_BACKLOG_WORK_ITEMS,
  RECEIVE_BACKLOG_WORK_ITEMS,
} from '../../actions/projects/backlogs';

import {
  REQUEST_PROJECT_ITERATIONS,
  RECEIVE_PROJECT_ITERATIONS,
  SET_ACTIVE_ITERATION,
  REQUEST_ITERATION_WORK_ITEMS,
  RECEIVE_ITERATION_WORK_ITEMS,
} from '../../actions/projects/iterations';

import * as utils from '../../lib/projectUtils';

const initialState = utils.getInitialState();

const projectsReducer = (state = initialState, action) => {
  const nextState = { ...state };

  switch (action.type) {
    case SET_ACTIVE_PROJECT:
      return utils.setActiveProject(nextState, action.payload);

    case REQUEST_PROJECTS:
      return utils.requestProjects(nextState, action.payload);

    case RECEIVE_PROJECTS:
      return utils.receiveProjects(nextState, action.payload.accountName, action.payload.projects);

    case REQUEST_PROJECT_CONFIG:
      return utils.requestProjectConfig(nextState, action.payload);

    case RECEIVE_PROJECT_CONFIG:
      return utils.receiveProjectConfig(nextState, action.payload.projectId, action.payload.config);

    case REQUEST_PROJECT_ABOUT:
      return utils.requestProjectAbout(nextState, action.payload);

    case RECEIVE_PROJECT_ABOUT:
      return utils.receiveProjectAbout(nextState, action.payload.projectId, action.payload.about);

    case SET_HAS_LOADED_A_PROJECT_BEFORE:
      return utils.setHasLoadedAProjectBefore(nextState, action.payload);
  
    case REQUEST_PROJECT_TEAMS:
      return utils.requestProjectTeams(nextState, action.payload);

    case RECEIVE_PROJECT_TEAMS:
      return utils.receiveProjectTeams(nextState, action.payload.projectId, action.payload.teams);

    case SET_ACTIVE_TEAM:
      return utils.setActiveTeam(nextState, action.payload.projectId, action.payload.teamId);

    case REQUEST_PROJECT_BACKLOGS:
      return utils.requestProjectBacklogs(nextState, action.payload.projectId, action.payload.teamId);

    case RECEIVE_PROJECT_BACKLOGS:
      return utils.receiveProjectBacklogs(nextState, action.payload.projectId, action.payload.teamId, action.payload.backlogs);
  
    case SET_ACTIVE_BACKLOG:
      return utils.setActiveBacklog(nextState, action.payload.projectId, action.payload.teamId, action.payload.backlogId);

    case REQUEST_BACKLOG_WORK_ITEMS:
      return utils.requestBacklogWorkItems(state, action.payload.projectId, action.payload.teamId, action.payload.backlogId);

    case RECEIVE_BACKLOG_WORK_ITEMS:
      return utils.receiveBacklogWorkItems(state, action.payload.projectId, action.payload.teamId, action.payload.backlogId, action.payload.items);

    case REQUEST_PROJECT_ITERATIONS:
      return utils.requestProjectIterations(nextState, action.payload.projectId, action.payload.teamId);

    case RECEIVE_PROJECT_ITERATIONS:
      return utils.receiveProjectIterations(nextState, action.payload.projectId, action.payload.teamId, action.payload.iterations);

    case SET_ACTIVE_ITERATION:
      return utils.setActiveIteration(nextState, action.payload.projectId, action.payload.teamId, action.payload.iterationId);

    case REQUEST_ITERATION_WORK_ITEMS:
      return utils.requestIterationWorkItems(state, action.payload.projectId, action.payload.teamId, action.payload.iterationId);

    case RECEIVE_ITERATION_WORK_ITEMS:
      return utils.receiveIterationWorkItems(state, action.payload.projectId, action.payload.teamId, action.payload.iterationId, action.payload.items);

    default:
      return state;
  }
};

export default projectsReducer;
