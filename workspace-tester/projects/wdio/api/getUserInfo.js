import request from 'request';
import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import allureReporter from '@wdio/allure-reporter';
import { errorLog, successLog, groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function getUserInfo({ credentials, userId, baseUrl }) {
    groupLog('getUserInfo by api');
    const finalBaseUrl = baseUrl || urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl: finalBaseUrl, authMode: 1, credentials });
    const userInfo = await getUserInfoById({ baseUrl: finalBaseUrl, session, userId });
    await logout({ baseUrl: finalBaseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`get User info by API when userId=${userId} , credentials=${JSON.stringify(credentials)}`);
    return userInfo;
}

async function getUserInfoById({ baseUrl, session, userId }) {
    const options = {
        url: baseUrl + `api/users/${userId}`,
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
                    successLog(`Getting user info by id '${userId}' is successful.`);
                    resolve(userInfo);
                } else {
                    errorLog(
                        `Getting user info by id '${userId}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Getting user info by id '${userId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
