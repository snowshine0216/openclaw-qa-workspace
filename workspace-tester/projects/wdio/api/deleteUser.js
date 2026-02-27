import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function deleteUser({ baseUrl, session, userId }) {
    const options = {
        url: baseUrl + `api/users/${userId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204 || response.statusCode === 200) {
                    successLog(`Successfully deleted user with ID '${userId}'`);
                    resolve(true);
                } else {
                    errorLog(
                        `Failed to delete user with ID '${userId}'. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject({ statusCode: response.statusCode, message: body });
                }
            } else {
                errorLog(`Failed to delete user with ID '${userId}'. Error: ${error}`);
                reject(error);
            }
        });
    });
}
