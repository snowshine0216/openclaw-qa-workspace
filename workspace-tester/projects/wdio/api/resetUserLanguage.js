import request from 'request';
import urlParser from './urlParser.js';
import authentication from './authentication.js';
import logout from './logout.js';
import getUserId from './getUserId.js';
import { errorLog, successLog, groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function resetUserLanguage({ credentials }) {
    groupLog('resetUserLanguage by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });

    await resetLanguage({ baseUrl, session, credentials });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function resetLanguage({ credentials }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const userId = await getUserId({ baseUrl, session });
    const options = {
        url: baseUrl + `api/users/${userId}/settings`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            language: {
                value: '',
            },
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Setting language to default for the user '${credentials.username}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Setting language to default for the user '${credentials.username}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Setting language to default for the user '${credentials.username}' failed.`);
                reject(error);
            }
        });
    });
}
