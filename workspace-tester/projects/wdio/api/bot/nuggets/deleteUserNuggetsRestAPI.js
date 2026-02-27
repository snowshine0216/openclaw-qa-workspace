import request from 'request';
import authentication from './../../authentication.js';
import { groupLog, groupLogEnd, errorLog, successLog } from './../../../config/consoleFormat.js';
import logout from './../../logout.js';
import urlParser from './../../urlParser.js';

export default async function deleteUserNuggets({ credentials }) {
    groupLog('delete user nuggets by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await deleteUserNuggetsRestAPI({ baseUrl, session });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function deleteUserNuggetsRestAPI({ baseUrl, session }) {
    const options = {
        url: baseUrl + `api/nuggets/`,
        method: 'DELETE',
        headers: {
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        timeout: 5000,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                errorLog(`Delete user nuggets by Rest API failed. Error: ${error.message}`);
                return reject(error);
            }

            if (response.statusCode === 204) {
                successLog('Delete user nuggets by Rest API is successful');
                resolve(response.statusCode);
            } else {
                let message = 'Unknown error';
                try {
                    const parsedBody = JSON.parse(body || '{}');
                    message = parsedBody.message || message;
                } catch (parseError) {
                    errorLog(`Response parsing failed: ${parseError.message}`);
                }
                errorLog(
                    `Delete user nuggets by Rest API failed. Status code: ${response.statusCode}. Message: ${message}`
                );
                reject(new Error(`Status code: ${response.statusCode}`));
            }
        });
    });
}

