import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function getDevConfigs({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'api/mstrServices/collabServerSettings/developerConfigs',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog('get devConfigs success');
                    resolve(body);
                } else {
                    errorLog(`get devConfigs failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`get devConfigs failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
