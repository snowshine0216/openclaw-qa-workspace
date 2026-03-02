import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function putCommonConfigs({ baseUrl, session, configInfo }) {
    const options = {
        url: baseUrl + 'api/mstrServices/collabServerSettings/commonConfigs',
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
                    successLog('put commonConfigs success');
                    resolve(body);
                } else {
                    errorLog(`put commonConfigs failed. Status code: ${response.statusCode}.`);
                    resolve(response.statusCode);
                }
            } else {
                errorLog(`put commonConfigs failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
