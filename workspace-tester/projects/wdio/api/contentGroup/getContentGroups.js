import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function getContentGroups({ baseUrl, session }) {
    const options = {
        url: baseUrl + `api/contentGroups`,
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
                    const contentGroups = JSON.parse(body);
                    successLog(`Get Content Groups is successful.`);
                    resolve(contentGroups);
                } else {
                    errorLog(
                        `Failed to get Content Groups. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Failed to get Content Groups. Error: ${error}`);
                reject(error);
            }
        });
    });
}
