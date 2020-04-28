import * as AuthSession from 'expo-auth-session';

// Routers
export const ACCOUNTS_ROUTER = 'AccountsRouter';
export const PROJECT_ROUTER = 'ProjectRouter';
export const SETTINGS_ROUTER = 'SettingsRouter';
export const PROJECT_BACKLOGS_ROUTER = 'ProjectBacklogsRouter';
export const PROJECT_ITERATIONS_ROUTER = 'ProjectIterationsRouter';

// Routes
export const LOGIN_ROUTE = 'Login';
export const ACCOUNTS_LIST_ROUTE = 'AccountsList';
export const PROJECTS_LIST_ROUTE = 'ProjectsList';
export const SEARCH_ROUTE = 'Search';
export const SETTINGS_ROUTE = 'Settings';
export const PROJECT_HOME_ROUTE = 'ProjectHome';
export const PROJECT_BACKLOGS_ROUTE = 'ProjectBacklogs';
export const PROJECT_BACKLOGS_WORK_ITEM_ROUTE = 'ProjectBacklogsWorkItem';
export const PROJECT_ITERATIONS_ROUTE = 'ProjectIterations';
export const PROJECT_ITERATIONS_WORK_ITEM_ROUTE = 'ProjectIterationsWorkItem';

// Auth
export const AUTH_CLIENT_ID = process.env.CLIENT_ID';
export const AUTH_RESPONSE_TYPE = 'Assertion';
export const AUTH_SCOPE = 'vso.agentpools vso.analytics vso.auditlog vso.build vso.code vso.code_status vso.connected_server vso.dashboards vso.entitlements vso.extension vso.extension.data vso.gallery vso.graph vso.identity vso.loadtest vso.memberentitlementmanagement vso.notification vso.packaging vso.project vso.release vso.securefiles_read vso.security_manage vso.serviceendpoint vso.symbols vso.taskgroups_read vso.test vso.tokenadministration vso.tokens vso.variablegroups_read vso.wiki vso.work';
export const AUTH_REDIRECT_URI = AuthSession.getRedirectUrl();

export const AUTH_AUTHORIZE_URL = `https://app.vssps.visualstudio.com/oauth2/authorize`
export const getAuthorizeUrl = (state) => AUTH_AUTHORIZE_URL +
  `?client_id=${AUTH_CLIENT_ID}` +
  `&response_type=${AUTH_RESPONSE_TYPE}` +
  `&state=${state}` +
  `&scope=${AUTH_SCOPE.replace(/ /g, '+')}` +
  `&redirect_uri=${encodeURIComponent(AUTH_REDIRECT_URI)}`;

export const AUTH_TOKEN_URL = `http://192.168.1.15:7071/api/ADO_OTG_OAuth`;

// Projects
export const PROJECT_ABOUT_CODE_FILENAME = '/README.md';
export const PROJECT_ABOUT_WIKI_FILENAME = '/Index';
export const PROJECT_ABOUT_PROVIDER_GIT = 'Git';
export const PROJECT_ABOUT_PROVIDER_TFVC = 'Tfvc';
export const PROJECT_ABOUT_PROVIDER_WIKI = 'Wiki';
export const PROJECT_ABOUT_PROVIDERS = {
  0: PROJECT_ABOUT_PROVIDER_GIT,
  1: PROJECT_ABOUT_PROVIDER_TFVC,
  2: PROJECT_ABOUT_PROVIDER_WIKI,
  [PROJECT_ABOUT_PROVIDER_GIT]: 0,
  [PROJECT_ABOUT_PROVIDER_TFVC]: 1,
  [PROJECT_ABOUT_PROVIDER_WIKI]: 2,
};
