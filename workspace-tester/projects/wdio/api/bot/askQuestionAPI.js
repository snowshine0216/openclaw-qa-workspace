import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function askQuestionAPI({ baseUrl, session, messageInfo, chatId, botInfo }) {
    const options = {
        url: baseUrl + `api/chats/${chatId}/messages`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': botInfo.project.id,
        },
        json: messageInfo,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    successLog(`Get message id '${body.id}' for chat '${chatId}' is successful`);
                    resolve(body.id);
                } else {
                    errorLog(
                        `Get message id for chat '${chatId}' failed.  Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Get message id for chat '${chatId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
