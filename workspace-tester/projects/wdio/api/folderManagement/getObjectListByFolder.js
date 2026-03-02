import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function getObjectListByFolder({ baseUrl, session, parentFolderId, projectId }) {
    const options = {
        url: baseUrl + `api/folders/${parentFolderId}`,
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
                    successLog(`Getting object list for folder '${parentFolderId}' is successful.`);
                    resolve(objectList);
                } else {
                    errorLog(
                        `Getting object list for folder '${parentFolderId}' is failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Getting object list for folder '${parentFolderId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
