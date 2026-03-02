import request from 'request';
import { errorLog, successLog, infoLog } from '../../config/consoleFormat.js';

export default async function deleteContentGroup({ baseUrl, session, contentGroupId }) {
    const options = {
        url: baseUrl + `api/objects/${contentGroupId}?type=77`,
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
                    successLog(`Delete Content Group '${contentGroupId}' is successful.`);
                    resolve(body);
                } else if (response.statusCode === 404) {
                    const bodyInfo = JSON.parse(body);
                    if (bodyInfo.code === 'ERR004' && bodyInfo.iServerCode === -2147216373) {
                        infoLog(`Delete not existed Content Group, ${bodyInfo.message}`); //To make sure content group in each case are deleted
                        resolve(bodyInfo);
                    } else {
                        errorLog(
                            `Delete Content Group '${contentGroupId}' failed. Status code: ${response.statusCode}. Message: ${bodyInfo.message}`
                        );
                        reject(bodyInfo);
                    }
                } else {
                    errorLog(
                        `Delete Content Group '${contentGroupId}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Delete Content '${contentGroupId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
