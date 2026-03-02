import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function getSubscriptionsByUser({ baseUrl, session, projectId }) {
    const options = {
        url: baseUrl + `api/subscriptions/?limit=-1&ignoreAdminPrivileges=true`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const objectList = JSON.parse(body);
                    successLog(`Getting subscription list is successful.`);
                    resolve(objectList);
                } else {
                    errorLog(
                        `Getting subscription list is failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Getting subscription list is failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
