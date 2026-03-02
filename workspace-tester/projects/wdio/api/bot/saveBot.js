import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function saveBotAPI({ baseUrl, session, botInfo, isCreateNew = true }) {
    const options = {
        url: baseUrl + `api/documents/${botInfo.instance.id}/instances/${botInfo.instance.instanceId}/save`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': botInfo.project.id,
        },
        json: botInfo.data,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (isCreateNew && response.statusCode === 201) {
                    const botId = body.id;
                    successLog(`Creating bot '${botId}' is successful`);
                    resolve(botId);
                } else if (!isCreateNew && response.statusCode === 204) {
                    successLog(`Editing bot '${botInfo.instance.id}' is successful`);
                    resolve();
                } else {
                    errorLog(
                        `Creating bot failed by '${JSON.stringify(botInfo)}'. Status code: 
                    ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Saving bot instance '${JSON.stringify(botInfo)}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
