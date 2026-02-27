import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function setUserPreference({ baseUrl, session, credentials, preference, value }) {
    const options = {
        url: baseUrl + `api/preferences/user/${preference}?value=${value}`,
        method: 'PUT',
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
                    successLog(`Setting preference for the user '${credentials.username}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Setting preference for the user '${credentials.username}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Setting preference for the user '${credentials.username}' failed.`);
                reject(error);
            }
        });
    });
}
