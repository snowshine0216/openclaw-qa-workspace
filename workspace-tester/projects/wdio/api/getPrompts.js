import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function getPrompts({ baseUrl, session, dossier }) {
    const options = {
        url: baseUrl + `api/documents/${dossier.id}/prompts`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': dossier.project.id,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Get Prompts for '${dossier.name}' with ID '${dossier.id}' is successful.`);
                    resolve(JSON.parse(body));
                } else {
                    errorLog(
                        `Get Prompts for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Get Prompts for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
