import request from 'request';
import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import allureReporter from '@wdio/allure-reporter';
import { errorLog, successLog, groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function getUserQuota({ credentials, userId }) {
    groupLog('getUserQuota by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const userInfo = await getUserQuotaById({ baseUrl, session, userId });
    await logout({ baseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`get User quota by API when userId=${userId} , credentials=${JSON.stringify(credentials)}`);
    return userInfo;
}

async function getUserQuotaById({ baseUrl, session, userId }) {
    const options = {
        url: baseUrl + `api/users/${userId}/quota`,
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
                    const quotaInfo = JSON.parse(body);
                    successLog(`Getting quota for user id '${userId}' succeeded.`);
                    resolve(quotaInfo);
                } else {
                    errorLog(
                        `Getting quota for user id '${userId}' failed. Status code: ${response.statusCode}, Body: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Getting quota for user id '${userId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}