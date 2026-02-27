import request from 'request';
import { errorLog } from '../../config/consoleFormat.js';

export default async function getAppInstallationId({ accessToken, conversationId, appName, type = 'chat' }) {
    const graphEndpoint = `https://graph.microsoft.com/beta/${type}/${conversationId}/installedApps?$expand=teamsApp,teamsAppDefinition&$filter=teamsApp/externalId eq 'a4863ac3-d779-59c4-a681-de1b544f941d'`;
    const options = {
        url: graphEndpoint,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const responsBody = JSON.parse(body);
                if (responsBody.value && responsBody.value[0]) {
                    const name = responsBody.value[0].teamsApp.displayName;
                    if (name === appName) {
                        const appInstallationId = responsBody.value[0].id;
                        resolve(appInstallationId);
                    } else {
                        errorLog(`App is not installed`);
                        reject(`App is not installed`);
                    }
                } else {
                    errorLog(`Unexpected response structure`);
                    resolve(null);
                }
            } else {
                errorLog(`Failed to get app info. Error: ${error}`);
                reject(error || `Failed to fetch app info. Status: ${response.statusCode} ${response.statusMessage}`);
            }
        });
    });
}
