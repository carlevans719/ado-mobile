# ADO Mobile

A mobile app for interacting with your ADO organisations, built in React Native


## Getting started

### ADO App Registration

Register an app [here](https://app.vsaex.visualstudio.com/app/register). Be sure to include all the scopes listed in [constants.js](./mobile/src/constants.js).

### Backend

Replace the `process.env.CLIENT_SECRET` with your app's client_secret (or figure out the process of pulling it in from the environment).

To run the function app in development using VSCode, install the Azure Functions extension (`ms-azuretools.vscode-azurefunctions
`) and run the "func" task.

You can use the same extension to bootstrap the deployment to Azure. Alternatively, the code can be copied/pasted into an existing node.js app.

### Frontend

Obvious `yarn` / `npm i` steps. Then head over to the [constants.js file](./mobile/src/constants.js) to fill in the CLIENT_ID with the one from your new app. While you're in there, check the value of the AUTH_TOKEN_URL constant is correct.

Run `yarn start` and you're good to go.

