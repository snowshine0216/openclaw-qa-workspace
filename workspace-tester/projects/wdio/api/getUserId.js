import request from 'request';
import { groupLog, groupLogEnd, errorLog, successLog } from '../config/consoleFormat.js';
import authentication from './authentication.js';
import getSessionFromCurrentBrowser from './../utils/getSessionFromCurrentBrowser.js';
import logout from './logout.js';
import urlParser from './urlParser.js';

export default async function getUserId({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'api/sessions/userInfo',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const userInfo = JSON.parse(body);
                    successLog(`Getting user info is successful. UserInfo: ${JSON.stringify(userInfo)}`);
                    resolve(userInfo.id);
                } else {
                    errorLog(`Getting user info is failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Getting user info is failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getUserIdByAPI({ credentials }) {
    groupLog('get user info by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    let session = null;
    if (credentials) {
        session = await authentication({ baseUrl, authMode: 1, credentials });
    } else {
        session = await getSessionFromCurrentBrowser();
    }
    const userId = await getUserId({ baseUrl, session });
    if (credentials) await logout({ baseUrl, session });
    groupLogEnd();
    return userId;
}
