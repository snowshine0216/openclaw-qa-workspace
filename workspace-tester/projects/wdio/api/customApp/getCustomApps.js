import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';

export default async function getCustomApps({ credentials }) {
    groupLog('get custom app list');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let customApps = await getCustomAppsAPI({ baseUrl, session });
    await logout({ baseUrl, session });
    groupLogEnd();
    return customApps;
}

export async function getCustomAppsAPI({ baseUrl, session }) {
    const options = {
        url: baseUrl + `api/v2/applications`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const customApps = JSON.parse(body).applications;
                    successLog(`Get CustomApps is successful.`);
                    resolve(customApps);
                } else {
                    errorLog(`Failed to get CustomApps. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body);
                }
            } else {
                errorLog(`Failed to get CustomApps. Error: ${error}`);
                reject(error);
            }
        });
    });
}

export async function getCustomAppById({ baseUrl, session, id }) {
    const options = {
        url: baseUrl + `api/v2/applications/${id}?outputFlag=INCLUDE_LOCALE&outputFlag=INCLUDE_ACL`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const customApp = JSON.parse(body);
                    successLog(`Get CustomApp by id = '${id}' is successful`);
                    resolve(customApp);
                } else {
                    errorLog(
                        `Get CustomApp by id = '${id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Get CustomApp by id = '${id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
