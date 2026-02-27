import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import getSessionFromCurrentBrowser from '../../utils/getSessionFromCurrentBrowser.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';

export default async function deleteBotList({ credentials, botList, projectId = 'B7CA92F04B9FAE8D941C3E9B7E0CD754' }) {
    // loop botIdList , delete each bot
    console.log(botList);
    for (const bot of botList) {
        if (bot) {
            await deleteBot({ credentials, botId: bot, projectId: projectId });
        }
    }
}

export async function deleteBot({ credentials, botId, projectId }) {
    groupLog('delete bot by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    let session = null;
    if (credentials) {
        session = await authentication({ baseUrl, authMode: 1, credentials });
    } else {
        session = await getSessionFromCurrentBrowser();
    }
    await deleteBotAPI({ baseUrl, session, botId, projectId });
    if (credentials) await logout({ baseUrl, session });
    await logout({ baseUrl, session });
    groupLogEnd();
}

export async function deleteBotAPI({ baseUrl, session, botId, projectId }) {
    const options = {
        url: baseUrl + `api/objects/${botId}?type=55`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`delete Bot is successful. id = '${botId}'`);
                    resolve(body);
                } else {
                    errorLog(`delete Bot failed. Status code: ${response.statusCode}. Message: ${response.body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`delete Bot '${botId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
