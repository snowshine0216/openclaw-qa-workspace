import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function deleteObject({ baseUrl, session, object_id, type, projectId }) {
    const options = {
        url: baseUrl + 'api/objects',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
        },
        json: [
            {
                type: type,
                id: object_id,
            },
        ],
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Deleting object '${object_id}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Deleting object '${object_id}' is failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Deleting object '${object_id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
