import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import allureReporter from '@wdio/allure-reporter';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../config/consoleFormat.js';

export default async function objectTelemetryStatistics({ credentials, project_guid, object_guid, days }) {
    groupLog('get object statistics by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const objectStatisticsInfo = await getObjectTelemetryStatistics({ baseUrl, session, project_guid, object_guid, days });
    await logout({ baseUrl, session });
    groupLogEnd();
    allureReporter.addStep(`getObjectTelemetryStatistics , credentials=${JSON.stringify(credentials)}`);
    console.log(objectStatisticsInfo);
    return objectStatisticsInfo;
}

async function getObjectTelemetryStatistics({ baseUrl, session, project_guid, object_guid, days }) {
    const options = {
        url: baseUrl + `api/telemetry/bots/${object_guid}/statistics?period=${days}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': project_guid,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const status = JSON.parse(body);
                    successLog(`Getting object statistics info is successful.`);
                    resolve(status);
                } else {
                    errorLog(`Getting object statistics info failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Getting object statistics info failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
