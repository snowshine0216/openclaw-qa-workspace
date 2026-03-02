import request from 'request';
import authentication from './authentication.js';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function setUserLanguage({ baseUrl, adminCredentials, userId, localeId }) {
    const session = await authentication({ baseUrl, authMode: 1, credentials: adminCredentials });
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
                value: localeId,
            },
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Setting language for the user '${userId}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Setting language for the user '${userId}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Setting language for the user '${userId}' failed.`);
                reject(error);
            }
        });
    });
}
