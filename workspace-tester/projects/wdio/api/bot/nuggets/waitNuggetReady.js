import request from 'request';
import { errorLog, successLog, groupLogEnd } from '../../../config/consoleFormat.js';
import authentication from '../../authentication.js';
import getSessionFromCurrentBrowser from '../../../utils/getSessionFromCurrentBrowser.js';
import urlParser from './../../urlParser.js';
import logout from '../../logout.js';

export default async function waitNuggetReady({ credentials, id }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    let session = null;
    if (credentials) {
        session = await authentication({ baseUrl, authMode: 1, credentials });
    } else {
        session = await getSessionFromCurrentBrowser();
    }
    for (let i = 0; i < 10; i++) {
        let status = await getNuggetById({ baseUrl, session, id });
        if (status !== 'ready') {
            await browser.pause(10000);
        } else {
            successLog(`Nugget with id = '${id}' is ready`);
            break;
        }
    }
    if (credentials) await logout({ baseUrl, session });
    groupLogEnd();
}

async function getNuggetById({ baseUrl, session, id }) {
    const options = {
        url: baseUrl + `api/nuggets/${id}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            // 'X-MSTR-ProjectID': projectId,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Get nuggets by Rest API id = '${id}' is successful`);
                    let status = JSON.parse(body).status;
                    resolve(status);
                } else {
                    errorLog(
                        `Get nuggets failed by Rest API id = '${id}', it might have been deleted.
                        Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Get nuggets by Rest API id = '${id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
