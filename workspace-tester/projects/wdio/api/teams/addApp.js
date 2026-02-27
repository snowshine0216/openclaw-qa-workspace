import request from 'request';
import { errorLog } from '../../config/consoleFormat.js';

export default async function addApp({ accessToken, conversationId, appCatalogId, type = 'chats' }) {
    const graphEndpoint = `https://graph.microsoft.com/beta/${type}/${conversationId}/installedApps`;
    const options = {
        url: graphEndpoint,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json',
        },
        json: {
            'teamsApp@odata.bind': `https://graph.microsoft.com/beta/appCatalogs/teamsApps/${appCatalogId}`,
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (!error && response.statusCode === 201) {
                resolve();
            } else {
                errorLog(`Failed to add app. Error: ${error}`);
                reject(error || `Failed to add app. Status: ${response.statusCode} ${response.statusMessage}`);
            }
        });
    });
}
