import request from 'request';
import { errorLog, successLog } from './../../../config/consoleFormat.js';

export default async function deleteNuggetsRestAPI({ baseUrl, session, id }) {
    const options = {
        url: baseUrl + `api/nuggets/${id}`,
        method: 'DELETE',
        headers: {
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Delete nuggets '${id}' by Rest API is successful`);
                    resolve(body);
                } else {
                    errorLog(
                        `Delete nuggets '${id}' by Rest API failed.
                        Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Delete nuggets '${id}' by Rest API failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}