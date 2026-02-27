import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function clearHistoryAPI({ baseUrl, session, chatId, botInfo }) {
    const options = {
        url: baseUrl + `api/chats/${chatId}/messages?type=history`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': botInfo.project.id,
        },
        json: {
            type: 'history',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Clear history for chat '${chatId}' is successful`);
                    resolve(response.statusCode);
                } else {
                    errorLog(
                        `Clear history for chat '${chatId}' failed.  Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Clear history for chat '${chatId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
