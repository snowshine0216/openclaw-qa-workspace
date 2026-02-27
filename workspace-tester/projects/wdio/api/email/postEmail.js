import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';

export default async function postEmail({ credentials, emailInfo }) {
    groupLog('post email by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await postEmailAPI({ baseUrl, session, emailInfo });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function postEmailAPI({ baseUrl, session, emailInfo }) {
    const options = {
        url: baseUrl + `api/emails`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
        json: emailInfo,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`post email is successful. `);
                    resolve(body);
                } else {
                    errorLog(`post email failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`post email failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
