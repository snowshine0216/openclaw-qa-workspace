import request from 'request';
import { errorLog, successLog } from '../../../config/consoleFormat.js';

export default async function updateBotInstanceByNuggetsAPI({ baseUrl, session, data }) {
    const options = {
        url: baseUrl + `api/bots/${data.instance.id}/instances/${data.instance.instanceId}/nuggets`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': data.project.id,
        },
        json: data.nuggets,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`Updating bot instance by nuggets '${JSON.stringify(data.nuggets)}' is successful`);
                    resolve();
                } else {
                    errorLog(
                        `Updating bot instance failed by nuggets '${JSON.stringify(data.nuggets)}'.
                        Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Updating bot instance by nuggets '${JSON.stringify(data)}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
