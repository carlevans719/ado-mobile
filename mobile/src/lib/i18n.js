
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

export const LOGIN_NAVTEXT = 'login_navText';
export const LOGIN_BTN = 'login_btn';
export const LOGIN_MESSAGE = 'login_message';

export const LOGOUT_BTN = 'logout_btn';
export const LOADING_MESSAGE = 'loading_message';

export const ACCOUNTS_NAVTEXT = 'accounts_navText';
export const ACCOUNTS_LIST_NAVTEXT = 'accountsList_navText';
export const NO_ACCOUNTS_FOUND_MESSAGE = 'noAccountsFound_message';

export const PROJECTS_LIST_NAVTEXT = 'projectsList_navText';
export const NO_PROJECTS_FOUND_MESSAGE = 'noProjectsFound_message';

export const SEARCH_NAVTEXT = 'search_navText';
export const SETTINGS_NAVTEXT = 'settings_navText';
export const SETTINGS_ACCOUNT_TITLE = 'settingsAccount_title';
export const NETWORK_CONNECTION_ERROR_MESSAGE = 'networkConnectionWarning_message';
export const PROJECT_HOME_NAVTEXT = 'projectHome_navText';
export const PROJECT_BACKLOGS_NAVTEXT = 'projectBacklogs_navText';
export const PROJECT_ITERATIONS_NAVTEXT = 'projectIterations_navText';
export const PROJECT_HOME_TITLE = 'projectHome_title';
export const PROJECT_HOME_OVERVIEW_TITLE = 'projectHomeOverview_title';
export const PROJECT_HOME_NO_CONTENT_MESSAGE = 'projectHomeNoContent_message';
export const PROJECT_HOME_NO_DESCRIPTION_MESSAGE = 'projectHomeNoDescription_message';
export const WORK_ITEMS_TITLE = 'workItems_title';

export const TEAM_PICKER_MESSAGE = 'teamPicker_message';
export const NO_TEAMS_MESSAGE = 'noTeams_message';

export const ITERATION_PICKER_MESSAGE = 'iterationPicker_message';
export const NO_ITERATIONS_MESSAGE = 'noIterations_message';

export const BACKLOG_PICKER_MESSAGE = 'backlogPicker_message';
export const NO_BACKLOGS_MESSAGE = 'noBacklogs_message';

export const ACCOUNT_PICKER_MESSAGE = 'accountPicker_message';
export const NO_ACCOUNTS_MESSAGE = 'noAccounts_message';

export const WORK_ITEM_ID_HEADING = 'workItemId_heading';
export const WORK_ITEM_TITLE_HEADING = 'workItemTitle_heading';
export const WORK_ITEM_TYPE_HEADING = 'workItemType_heading';
export const WORK_ITEM_ASSIGNEE_HEADING = 'workItemAssignee_heading';
export const WORK_ITEM_STATUS_HEADING = 'workItemStatus_heading';
export const NO_WORK_ITEMS_MESSAGE = 'noWorkItems_message';
export const UNASSIGNED_MESSAGE = 'unassigned_message';

const translations = {
  en: {
    [LOGIN_NAVTEXT]: 'Log in',
    [LOGIN_BTN]: 'Log in',
    [LOGIN_MESSAGE]: 'Click the button below to log in with your Microsoft® account',

    [LOGOUT_BTN]: 'Log out',
    [LOADING_MESSAGE]: 'Loading...',

    [ACCOUNTS_NAVTEXT]: 'Organisations',
    [ACCOUNTS_LIST_NAVTEXT]: 'Organisations',
    [NO_ACCOUNTS_FOUND_MESSAGE]: 'No organisations found',

    [PROJECTS_LIST_NAVTEXT]: 'Projects',
    [NO_PROJECTS_FOUND_MESSAGE]: 'No projects found',

    [SEARCH_NAVTEXT]: 'Search',
    [SETTINGS_NAVTEXT]: 'Settings',
    [SETTINGS_ACCOUNT_TITLE]: 'Account',
    [NETWORK_CONNECTION_ERROR_MESSAGE]: 'No internet connection can be detected',
    [PROJECT_HOME_NAVTEXT]: 'Home',
    [PROJECT_BACKLOGS_NAVTEXT]: 'Backlogs',
    [PROJECT_ITERATIONS_NAVTEXT]: 'Iterations',
    [PROJECT_HOME_TITLE]: 'About this project',
    [PROJECT_HOME_OVERVIEW_TITLE]: 'Overview',
    [PROJECT_HOME_NO_CONTENT_MESSAGE]: 'No project overview found',
    [PROJECT_HOME_NO_DESCRIPTION_MESSAGE]: 'No project description found',
    [WORK_ITEMS_TITLE]: 'Work Items',
    [TEAM_PICKER_MESSAGE]: 'Team',
    [NO_TEAMS_MESSAGE]: 'No Teams Available',
    [ITERATION_PICKER_MESSAGE]: 'Iteration',
    [NO_ITERATIONS_MESSAGE]: 'No Iterations Available',
    [BACKLOG_PICKER_MESSAGE]: 'Backlog',
    [NO_BACKLOGS_MESSAGE]: 'No Backlogs Available',
    [ACCOUNT_PICKER_MESSAGE]: 'Account',
    [NO_ACCOUNTS_MESSAGE]: 'No Accounts Available',
    [WORK_ITEM_ID_HEADING]: 'ID',
    [WORK_ITEM_TITLE_HEADING]: 'Title',
    [WORK_ITEM_TYPE_HEADING]: 'Type',
    [WORK_ITEM_ASSIGNEE_HEADING]: 'Assignee',
    [WORK_ITEM_STATUS_HEADING]: 'Status',
    [NO_WORK_ITEMS_MESSAGE]: 'No Work Items Found',
    [UNASSIGNED_MESSAGE]: 'Unassigned',
  },
}

i18n.fallbacks = true;
i18n.translations = translations;
i18n.locale = Localization.locale;

export default i18n;
