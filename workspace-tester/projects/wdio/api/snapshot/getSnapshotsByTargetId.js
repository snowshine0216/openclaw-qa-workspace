import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';

export default async function getSnapshotsByTargetId({ credentials, targetId }) {
    groupLog('get snapshot by targetId via api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const result = await getSnapshot({ baseUrl, session, targetId });
    await logout({ baseUrl, session });
    groupLogEnd();
    return result;
}

async function getSnapshot({ baseUrl, session, targetId }) {
    const optionsForSnapshot = {
        url: baseUrl + `api/v2/historyList?scope=SINGLE_LIBRARY_USER&targetInfo.objectId=${targetId}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(optionsForSnapshot, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`get snapshot for targetId=${targetId} is successful.`);
                    const result = JSON.parse(body);
                    resolve(result.historyList);
                } else {
                    errorLog(
                        `get snapshot for targetId=${targetId} failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`get snapshot for targetId=${targetId} failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
