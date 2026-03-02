import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function getDocInfo(originalRequest) {
    const options = {
        url: originalRequest.url,
        method: originalRequest.method || 'GET',
        headers: {
            ...originalRequest.headers,
            // 'X-MSTR-AuthToken': session.token,
            // 'X-MSTR-ProjectID': shortcut.project.id,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`get user info is successful.`);
                    //resolve(bookmark.id);
                    resolve(body);
                } else {
                    errorLog(`get user info is ' failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`get user info' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
