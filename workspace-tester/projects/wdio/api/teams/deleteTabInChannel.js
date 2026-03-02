import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import listTabsInChannel from './listTabsInChannel.js';
import getChannelIDByName from './getChannelIDByName.js';

export default async function deleteTabInChannel({ accessToken, teamId, channelName, tabName }) {
    groupLog('delete tab in teams channel by api');
    // const accessToken = await teamsLogin({ clientId, tenantId, clientSecret });
    const channelId = await getChannelIDByName({ accessToken, teamId, channelName });
    const tabs = await listTabsInChannel({ accessToken, teamId, channelId });
    const tab = tabs.find((tab) => tab.displayName === tabName);
    if (!tab) {
        errorLog(`Tab ${tabName} not found.`);
    } else {
        await deleteTabAPI({ accessToken, teamId, channelId, tabId: tab.id });
    }
    groupLogEnd();
    return;
}

export async function deleteAllTabsInChannel({ accessToken, teamId, channelName }) {
    groupLog('Delete all tabs in channel' + channelName);
    const channelId = await getChannelIDByName({ accessToken, teamId, channelName });
    let tabs = await listTabsInChannel({ accessToken, teamId, channelId });
    tabs = tabs.filter(
        (tab) => tab.displayName !== 'Files' && tab.displayName !== 'Posts' && tab.displayName !== 'Notes'
    );
    if (tabs) {
        for (const tab of tabs) {
            console.log('Delete tab: ' + tab.displayName);
            await deleteTabAPI({ accessToken, teamId, channelId, tabId: tab.id });
        }
    }
}

export async function deleteTabAPI({ accessToken, teamId, channelId, tabId }) {
    const graphEndpoint = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/tabs/${tabId}`;
    const options = {
        url: graphEndpoint,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 204) {
                successLog(`delete Tab is successful.`);
                resolve();
            } else {
                errorLog(`delete tab failed. Error code: ${response.statusCode}. Error: ${error}`);
                reject(error);
            }
        });
    });
}
