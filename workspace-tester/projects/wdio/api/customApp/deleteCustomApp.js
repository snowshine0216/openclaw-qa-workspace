import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../../config/consoleFormat.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';

export async function deleteCustomAppList({ credentials, customAppIdList }) {
    let customAppId;
    // loop customAppIdList , delete each customAppId
    for (customAppId of customAppIdList) {
        if (customAppId) {
            await deleteCustomApp({ credentials, customAppId });
        }
    }
}

export default async function deleteCustomApp({ credentials, customAppId }) {
    groupLog('delete custom app by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await deleteCustomAppAPI({ baseUrl, session, customAppId });
    await logout({ baseUrl, session });
    groupLogEnd();
}

export async function deleteCustomAppAPI({ baseUrl, session, customAppId }) {
    const options = {
        url: baseUrl + `api/objects/${customAppId}?type=78`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`delete CustomApp is successful. id = '${customAppId}'`);
                    resolve(body);
                } else {
                    errorLog(`delete CustomApp ${customAppId} failed. Status code: ${response.statusCode}. Message: ${body.message}`);
                    reject(body.message);
                }
            } else {
                errorLog(`delete CustomApp '${customAppId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
