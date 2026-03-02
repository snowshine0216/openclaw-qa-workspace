import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function createGroup({ baseUrl, session, name, color }) {
    const options = {
        url: baseUrl + `api/library/shortcutGroups`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: {
            name: name,
            color: color,
            itemKeys: [],
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    successLog(`Creating group '${name}' is successful.    id = '${body.id}'`);
                    setTimeout(() => {
                        resolve(body);
                    }, 1000);
                } else {
                    errorLog(`Creating group '${name}' failed. Status code: ${response.statusCode}. Message: ${body}`);
                    reject(body);
                }
            } else {
                errorLog(`Creating group '${name}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
