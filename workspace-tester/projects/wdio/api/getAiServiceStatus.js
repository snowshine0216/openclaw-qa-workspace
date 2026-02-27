import request from 'request';
import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import allureReporter from '@wdio/allure-reporter';
import { errorLog, successLog, groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function aiServiceStatus({ credentials }) {
    groupLog('get ai service status by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const userInfo = await getAiServiceStatus({ baseUrl, session });
    await logout({ baseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`getAiServiceStatus , credentials=${JSON.stringify(credentials)}`);
    return userInfo;
}

async function getAiServiceStatus({ baseUrl, session }) {
    const options = {
        url: baseUrl + `api/aiservice/status`,
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
                    const status = JSON.parse(body);
                    successLog(`Getting ai service status is successful.`);
                    resolve(status);
                } else {
                    errorLog(`Getting ai service status failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Getting ai service status failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
