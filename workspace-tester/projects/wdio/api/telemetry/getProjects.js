import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../config/consoleFormat.js';

export default async function projectInfo({ credentials }) {
    groupLog('get project info by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const projInfo = await getProjectInfo({ baseUrl, session });
    await logout({ baseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`getProjectInfo , credentials=${JSON.stringify(credentials)}`);
    console.log(projInfo);
    const projectName = 'Platform Analytics';
    let projectId;
    for (const project of projInfo) {
        if (project.name === projectName) {
            projectId = project.id;
            break;
        }
    }
    console.log(`Project ID for '${projectName}': ${projectId}`);

    return projectId;
}

async function getProjectInfo({ baseUrl, session }) {
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
