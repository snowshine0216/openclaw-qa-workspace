import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';

export default async function getSnapshots({ credentials, scope = 'single_user' }) {
    // admin: all_users
    groupLog('get snapshot by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let historyLists = [];
    try {
        let response = await getSnapshot({ baseUrl, session, scope });
        response = JSON.parse(response);
        response.historyList.forEach((history) => {
            let messageId = history.messageId;
            let projectId = history.projectId;
            historyLists.push({ messageId, projectId });
        });
    } catch (error) {
        errorLog(`Error get snapshot, user: ${credentials.username}, error: ${error}`);
    }
    await logout({ baseUrl, session });
    groupLogEnd();
    return historyLists;
}

async function getSnapshot({ baseUrl, session, scope = 'single_user' }) {
    const optionsForSnapshot = {
        url: baseUrl + `api/historyList?scope=${scope}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(optionsForSnapshot, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`get snapshot  is successful.`);
                    resolve(body);
                } else {
                    errorLog(`get snapshot failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`get snapshot failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
