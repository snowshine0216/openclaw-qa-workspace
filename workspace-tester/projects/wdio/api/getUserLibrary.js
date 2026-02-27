import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function getUserLibrary({ baseUrl, session }) {
    const options = {
        url: baseUrl + 'api/v2/library?outputFlag=FILTER_TOC&applicationId=C2B2023642F6753A2EF159A75E0CFF29',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Getting user library is successful.`);
                    resolve(JSON.parse(body));
                } else {
                    errorLog(`Getting user library' failed. Status code: ${response.statusCode}.}`);
                    reject(body);
                }
            } else {
                errorLog(`Getting user library' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
