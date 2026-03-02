import request from 'request';
import { errorLog } from '../../config/consoleFormat.js';

export default async function listTabsInChannel({ accessToken, teamId, channelId }) {
    const graphEndpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/tabs`;
    const options = {
        url: graphEndpoint,
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const tabs = JSON.parse(body).value;
                tabs.forEach((tab) => {
                    console.log(`Tab Name: ${tab.displayName}, Tab ID: ${tab.id}`);
                });
                resolve(tabs);
            } else {
                errorLog(`Failed to get tab infro. Error: ${error}`);
                reject(error || `Failed to fetch tab info. Status: ${response.statusCode} ${response.statusMessage}`);
            }
        });
    });
}
