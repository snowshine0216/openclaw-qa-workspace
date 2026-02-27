import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function thumbDownAPI({ baseUrl, session, chatId, msgId, botInfo, op, path, value }) {
    const options = {
        url: baseUrl + `api/chats/${chatId}/messages/${msgId}`,
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': botInfo.project.id,
        },
        json: {
            operationList: [
                {
                    op: op,
                    path: path,
                    value: value,
                },
            ],
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Thumb down '${value}' for message '${msgId}' is successful`);
                    resolve(response.statusCode);
                } else {
                    errorLog(
                        `Thumb down'${value}' for message '${msgId}' is failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(response.statusCode);
                }
            } else {
                errorLog(`Thumb down '${value}' for message '${msgId}' is failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
