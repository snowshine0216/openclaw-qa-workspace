import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function deleteFavorites({ baseUrl, session, values }) {
    const options = {
        url: baseUrl + 'api/library/shortcutGroups/favorites',
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: {
            operationList: [
                {
                    op: 'removeElements',
                    path: '/itemKeys',
                    value: values,
                },
            ],
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Deleting favorites '${values}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Deleting favorites '${values}' is failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Deleting favorites '${values}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
