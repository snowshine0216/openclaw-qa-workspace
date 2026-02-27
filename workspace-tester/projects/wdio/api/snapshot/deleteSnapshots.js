import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';

export default async function deleteSnapshots({ credentials, historyLists, removeOthersMessage = false }) {
    groupLog('delete snapshot by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    for (const history of historyLists) {
        try {
            await deleteSnapshot({ baseUrl, session, history, removeOthersMessage });
        } catch (error) {
            errorLog(`Error delete snapshot, messageId '${history.messageId}': ${error}`);
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function deleteSnapshot({ baseUrl, session, history, removeOthersMessage = false }) {
    const optionsForSnapshot = {
        url: baseUrl + `api/historyList/${history.messageId}?removeOthersMessage=${removeOthersMessage}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': history.projectId,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(optionsForSnapshot, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 202) {
                    successLog(`Delete snapshot for messageId '${history.messageId}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Delete snapshot for messageId '${history.messageId}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Delete snapshot for messageId '${history.messageId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
