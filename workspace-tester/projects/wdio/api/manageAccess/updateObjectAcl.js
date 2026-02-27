import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function updateObjectAcl({ baseUrl, session, object, payload }) {
    const headers = {
        'Content-Type': 'application/json',
        Cookie: session.cookie,
        'X-MSTR-AuthToken': session.token,
    };
    if (object.project) {
        headers['X-MSTR-ProjectID'] = object.project.id;
    }
    const options = {
        url: baseUrl + `api/objects/${object.id}?type=${object.type || 55}`,
        method: 'PUT',
        headers,
        json: { ...payload, autoComplete: true },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Update Object ACL for '${object.name}' with ID '${object.id}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Update Object ACL for '${object.name}' with ID '${object.id}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Update Object ACL for '${object.name}' with ID '${object.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
