import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function copyObject({ baseUrl, session, object }) {
    const options = {
        url: baseUrl + 'api/objects',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': object.projectId,
        },
        json: {
            objects: [
                {
                    type: object.type,
                    id: object.id,
                    newName: object.newName,
                },
            ],
            copyTo: object.targetFolderID,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Copy object '${object.id}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Copy object '${object.id}' is failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Copy object '${object.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
