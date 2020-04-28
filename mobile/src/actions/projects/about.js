import { httpFetch } from '../../lib/http';
import { PROJECT_ABOUT_CODE_FILENAME, PROJECT_ABOUT_WIKI_FILENAME, PROJECT_ABOUT_PROVIDERS } from '../../constants';

export const FETCH_PROJECT_CONFIG = 'fetchProjectConfig';
export const fetchProjectConfig = (accountName, projectId) => async (dispatch) => {
  dispatch(requestProjectConfig(projectId));

  return httpFetch(`https://dev.azure.com/${accountName}/${projectId}?__rt=fps&__ver=2`)
    .then(projectConfig => {
      const about = projectConfig?.fps?.dataProviders?.data['ms.vss-tfs-web.about-project-data-provider-verticals']?.aboutProjectData;
      const overview = projectConfig?.fps?.dataProviders?.data['ms.vss-tfs-web.project-overview-page-data-provider-verticals']?.projectOverviewPageData;

      return dispatch(receiveProjectConfig(projectId, { about, overview }));
    });
};

export const REQUEST_PROJECT_CONFIG = 'requestProjectConfig';
export const requestProjectConfig = (projectId) => ({
  type: REQUEST_PROJECT_CONFIG,
  payload: projectId,
});

export const RECEIVE_PROJECT_CONFIG = 'receiveProjectConfig';
export const receiveProjectConfig = (projectId, payload) => ({
  type: RECEIVE_PROJECT_CONFIG,
  payload: {
    projectId,
    config: payload,
  },
});

export const FETCH_PROJECT_ABOUT = 'fetchProjectAbout';
export const fetchProjectAbout = (accountName, projectId, repositoryId, repositoryType) => async (dispatch) => {
  dispatch(requestProjectAbout(projectId));

  const url = (() => {
    if (repositoryType === PROJECT_ABOUT_PROVIDERS.Git) {
      return `https://dev.azure.com/${accountName}/${projectId}/_apis/git/repositories/${repositoryId}/items?path=${encodeURIComponent(PROJECT_ABOUT_CODE_FILENAME)}&includeContent=true&api-version=5.1`;
    }

    if (repositoryType === PROJECT_ABOUT_PROVIDERS.Wiki) {
      return `https://dev.azure.com/${accountName}/${projectId}/_apis/wiki/wikis/${repositoryId}/pages?path=${encodeURIComponent(PROJECT_ABOUT_WIKI_FILENAME)}&includeContent=True&api-version=5.1`;
    }

    return null;
  })();

  if (!url) {
    return dispatch(receiveProjectAbout(projectId, {}));
  }

  return httpFetch(url, { headers: { Accept: 'application/json' } })
    .then(projectAbout => dispatch(receiveProjectAbout(projectId, projectAbout)));
};

export const REQUEST_PROJECT_ABOUT = 'requestProjectAbout';
export const requestProjectAbout = (projectId) => ({
  type: REQUEST_PROJECT_ABOUT,
  payload: projectId,
});

export const RECEIVE_PROJECT_ABOUT = 'receiveProjectAbout';
export const receiveProjectAbout = (projectId, payload) => ({
  type: RECEIVE_PROJECT_ABOUT,
  payload: {
    projectId,
    about: payload,
  },
});
