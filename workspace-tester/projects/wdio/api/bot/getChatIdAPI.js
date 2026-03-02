import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function getChatIdAPI({ baseUrl, session, botId, botInfo }) {
    const options = {
        url: baseUrl + `api/bots/${botId}/chats`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': botInfo.project.id,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            const bodyParse = JSON.parse(body);
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Get chat id '${bodyParse.id} 'for bot '${botId}' is successful`);
                    resolve(bodyParse);
                } else {
                    errorLog(`Get chat id for bot '${botId}' failed. 
                    Status code: ${response.statusCode}. Message: ${bodyParse.message}`);
                    reject(bodyParse.message);
                }
            } else {
                errorLog(`Get chat id for bot '${botId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
