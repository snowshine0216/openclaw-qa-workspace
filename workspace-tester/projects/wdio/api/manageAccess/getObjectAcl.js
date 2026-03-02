import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function getObjectAcl({ baseUrl, session, object }) {
    const options = {
        url: baseUrl + `api/objects/${object.id}?type=${object.type || 55}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': object.project.id,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const objectInfo = JSON.parse(body);
                    successLog(`Get Object ACL for '${object.name}' with ID '${object.id}' is successful.`);
                    resolve(objectInfo.acl);
                } else {
                    errorLog(
                        `Get Object ACL for '${object.name}' with ID '${object.id}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Get Object ACL for '${object.name}' with ID '${object.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
