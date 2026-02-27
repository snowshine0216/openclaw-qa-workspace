import request from 'request';
import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { errorLog, successLog, groupLog, groupLogEnd } from './../config/consoleFormat.js';

export default async function getProjectInfo({ credentials }) {
    groupLog('get project info by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const project = await projectInfo({ baseUrl, session });
    await logout({ baseUrl, session });
    groupLogEnd();
    return project;
}

export async function projectInfo({ baseUrl, session }) {
    const options = {
        url: baseUrl + `api/projects`,
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
                    successLog(`Getting project info is successful.`);
                    resolve(status);
                } else {
                    errorLog(`Getting project info failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Getting project info failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
