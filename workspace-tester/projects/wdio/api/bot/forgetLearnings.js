import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import getSessionFromCurrentBrowser from '../../utils/getSessionFromCurrentBrowser.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';

export default async function forgetAllLearnings(credentials = null) {
    groupLog('forgetLearning by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    let session = null;
    if (credentials) {
        session = await authentication({ baseUrl, authMode: 1, credentials });
    } else {
        session = await getSessionFromCurrentBrowser();
    }
    await forgetLearnings({ baseUrl: baseUrl, session: session });
    if (credentials) await logout({ baseUrl, session });
    groupLogEnd();
}

export async function forgetLearnings({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'api/learnings',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Deleting learnings are successful.`);
                    resolve();
                } else {
                    errorLog(`Deleting learnings are failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Deleting learnings are failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
