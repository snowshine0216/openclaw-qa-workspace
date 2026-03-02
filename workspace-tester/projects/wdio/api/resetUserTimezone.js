import request from 'request';
import urlParser from './urlParser.js';
import authentication from './authentication.js';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function resetUserTimezone({ userId, credentials }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const options = {
        url: baseUrl + `api/users/${userId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            operationList: [
                {
                    op: 'replace',
                    path: '/defaultTimezone',
                    value: { id: '' },
                },
            ],
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(
                        `Setting user level Timezone to default for the user '${credentials.username}' is successful.`
                    );
                    resolve();
                } else {
                    errorLog(
                        `Setting user level Timezone to default for the user '${credentials.username}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Setting user level Timezone to default for the user '${credentials.username}' failed.`);
                reject(error);
            }
        });
    });
}
