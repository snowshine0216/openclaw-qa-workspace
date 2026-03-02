import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function logout({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'logout',
        method: 'POST',
        headers: {
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        form: {
            sessionId: session.token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 302 || response.statusCode === 303) {
                    // response code changed to 303 on container env
                    successLog('Logout with api is successful.');
                    resolve();
                } else {
                    errorLog('Logout with api failed. status code:', response.statusCode);
                    errorLog('Logout with api failed. message:', body);
                    reject(body);
                }
            } else {
                errorLog('Logout with api failed.');
                reject(error);
            }
        });
    });
}
