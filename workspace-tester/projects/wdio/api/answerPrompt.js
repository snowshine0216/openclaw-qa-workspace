import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function answerPrompt({ baseUrl, session, dossier, dossierInstance }) {
    const options = {
        url: baseUrl + `api/documents/${dossier.id}/instances/${dossierInstance.id}/promptsAnswers`,
        method: 'POST',
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
                if (response.statusCode === 204) {
                    successLog(`Answer Prompt for '${dossier.name}' with ID '${dossier.id}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Answer Prompt for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Answer Prompt for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
