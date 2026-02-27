import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function removeApp({ accessToken, conversationId, appInstallationId, type }) {
    if (!appInstallationId) {
        errorLog(`there is no appInstallationId get`);
        return;
    }
    const graphEndpoint = `https://graph.microsoft.com/beta/${type}/${conversationId}/installedApps/${appInstallationId}`;
    const options = {
        url: graphEndpoint,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (!error && response.statusCode === 204) {
                successLog(`remove app successully`);
                resolve();
            } else {
                errorLog(`Failed to remove app. Error: ${error}`);
                reject(error || `Failed to remove app. Status: ${response.statusCode} ${response.statusMessage}`);
            }
        });
    });
}
