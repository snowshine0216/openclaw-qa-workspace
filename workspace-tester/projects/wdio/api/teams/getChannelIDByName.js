import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function getChannelIDByName({ accessToken, teamId, channelName }) {
    const graphEndpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`;
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
                const channels = JSON.parse(body).value;
                const matchingChannel = channels.find((channel) => channel.displayName === channelName);
                if (matchingChannel) {
                    successLog(`Channel Name: ${matchingChannel.displayName}, Channel ID: ${matchingChannel.id}`);
                    resolve(matchingChannel.id);
                } else {
                    errorLog(`Failed to find channel ${channelName}`);
                    reject(`Failed to find channel ${channelName}`);
                }
            } else {
                errorLog(`Failed to get channel id by name. Error: ${error}. Response: ${response}. Body: ${body}`);
                reject(
                    error ||
                        `Failed to get channel id by name. Status: ${response.statusCode} ${response.statusMessage}`
                );
            }
        });
    });
}
