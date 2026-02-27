import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function createBotInstanceAPI({ baseUrl, session, botInfo }) {
    const options = {
        url: baseUrl + `api/dossiers/draft/instances`,
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
                if (response.statusCode === 201) {
                    successLog(`Creating bot instance '${JSON.stringify(body)}' is successful`);
                    resolve({ instanceId: body.mid, id: body.id });
                } else {
                    errorLog(
                        `Creating bot instance failed by '${JSON.stringify(botInfo)}'. 
                        Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating bot instance '${JSON.stringify(botInfo)}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
