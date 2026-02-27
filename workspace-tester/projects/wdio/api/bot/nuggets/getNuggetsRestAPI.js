import request from 'request';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../../config/consoleFormat.js';
import authentication from '../../authentication.js';
import getSessionFromCurrentBrowser from '../../../utils/getSessionFromCurrentBrowser.js';
import logout from '../../logout.js';
import urlParser from './../../urlParser.js';

export default async function getNuggetsRestAPI({ credentials, id }) {
    groupLog('Get nuggets by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    let session = null;
    if (credentials) {
        session = await authentication({ baseUrl, authMode: 1, credentials });
    } else {
        session = await getSessionFromCurrentBrowser();
    }
    await getNuggetById({ baseUrl, session, id });
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
                    resolve();
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
