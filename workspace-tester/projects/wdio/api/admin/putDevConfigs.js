import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function putDevConfigs({ baseUrl, session, configInfo }) {
    const options = {
        url: baseUrl + 'api/mstrServices/collabServerSettings/developerConfigs',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: configInfo,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog('put developerConfigs success');
                    resolve(body);
                } else {
                    errorLog(`put developerConfigss failed. Status code: ${response.statusCode}.`);
                    resolve(response.statusCode);
                }
            } else {
                errorLog(`put developerConfigs failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
