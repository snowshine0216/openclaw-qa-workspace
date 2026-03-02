import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function getTabInChannel({ accessToken, teamId, channelId, tabId }) {
    const graphEndpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/tabs/${tabId}`;
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
                const tabInfo = JSON.parse(body).value;
                console.log(`Tab Name: ${tab.displayName}`);
                resolve(tabInfo);
            } else {
                errorLog(`Failed to get tab infro. Error: ${error}`);
                reject(error || `Failed to fetch tab info. Status: ${response.statusCode} ${response.statusMessage}`);
            }
        });
    });
}
