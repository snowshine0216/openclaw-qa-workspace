import request from 'request';
import authentication from '../../authentication.js';
import logout from '../../logout.js';
import urlParser from '../../urlParser.js';
import { errorLog, groupLog, groupLogEnd, successLog } from '../../../config/consoleFormat.js';

export default async function clearSnapshotsByAPI({ credentials, projectId, chatsId }) {
    groupLog('clear bot snapshots by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await clearSnapshots({ baseUrl, session, projectId, chatsId });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function clearSnapshots({ baseUrl, session, projectId, chatsId }) {
    const options = {
        url: baseUrl + `api/chats/${chatsId}/messages?type=snapshots`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            id: chatsId,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Clearing snapshots is successful. ChatsId: ${chatsId}`);
                    resolve(body);
                } else {
                    errorLog(
                        `Clearing snapshots failed. Status code: ${response.statusCode}. Message: ${response.body}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Clearing snapshots for ChatsID '${botId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
