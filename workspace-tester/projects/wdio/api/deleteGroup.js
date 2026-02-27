import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function deleteGroup({ baseUrl, session, groupId }) {
    const options = {
        url: baseUrl + `api/library/shortcutGroups/${groupId}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Deleting group '${groupId}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Deleting group '${groupId}' is failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Deleting group '${groupId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
