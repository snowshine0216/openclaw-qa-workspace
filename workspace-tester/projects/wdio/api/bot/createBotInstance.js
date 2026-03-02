import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

export default async function createBotInstance({ baseUrl, session, bot }) {
    const options = {
        url: baseUrl + `api/dossiers/${bot.id}/instances`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': bot.project.id,
        },
        json: {
            persistViewState: true,
            disableManipulationsAutoSaving: true,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    const instanceId = body.mid;
                    successLog(
                        `Creating bot instance for '${bot.name}' with ID '${bot.id}' is successful. Bot instance ID: ${instanceId}`
                    );
                    resolve({ id: bot.id, instanceId });
                } else {
                    errorLog(
                        `Creating bot instance for '${bot.name}' with ID '${bot.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating bot instance for '${bot.name}' with ID '${bot.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
