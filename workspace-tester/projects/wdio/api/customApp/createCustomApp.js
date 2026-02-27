import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';

export default async function createCustomApp({ credentials, customAppInfo }) {
    groupLog('create custom app by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let customappId = await createCustomAppAPI({ baseUrl, session, customAppInfo });
    await logout({ baseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`create custom app by credentials=${JSON.stringify(credentials)}`);
    return customappId;
}

async function createCustomAppAPI({ baseUrl, session, customAppInfo }) {
    const options = {
        url: baseUrl + `api/v2/applications`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: customAppInfo,
    };
    let customappId = '';

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    customappId = response.headers['location'].split('/').slice(-1).shift();
                    // customappId = response.headers['location'].split('/')[-1]
                    successLog(`Creating CustomApp '${customAppInfo.name}' is successful. id = '${customappId}'`);
                    resolve(customappId);
                } else {
                    errorLog(
                        `Creating CustomApp '${customAppInfo.name}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating CustomApp '${customAppInfo.name}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
