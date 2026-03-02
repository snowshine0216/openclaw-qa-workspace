import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import urlParser from '../urlParser.js';
import logout from '../logout.js';

export default async function copyADC({ credentials, projectId, id, newName, targetFolderId }) {
    let baseUrl;
    let session;
    try {
        baseUrl = urlParser(browser.options.baseUrl);
        session = await authentication({ baseUrl, authMode: 1, credentials });
        const options = {
            url: baseUrl + 'api/objects',
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Cookie: session.cookie,
                'X-MSTR-AuthToken': session.token,
                'X-MSTR-ProjectID': projectId,
            },
            json: {
                objects: [
                    {
                        type: 55,
                        id,
                        newName,
                    },
                ],
                copyTo: targetFolderId,
            },
        };

        const newADCId = await new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if (!error) {
                    if (response.statusCode === 200) {
                        successLog(`Copy ADC '${id}' is successful.`);
                        resolve(body.success[0].id); // the new ADC id
                    } else {
                        errorLog(`Copy ADC '${id}' is failed. Status code: ${response.statusCode}. Message: ${body}`);
                        reject(body);
                    }
                } else {
                    errorLog(`Copy ADC '${id}' failed. Error: ${error}`);
                    reject(error);
                }
            });
        });
        return newADCId;
    } finally {
        if (session) {
            await logout({ baseUrl, session });
        }
    }
}
