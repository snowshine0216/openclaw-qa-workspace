import request from 'request';
import { errorLog, infoLog, successLog } from '../config/consoleFormat.js';

export default async function resetManipulations({ baseUrl, session, dossier, reset }, retry = 1) {
    const options = {
        url: baseUrl + `api/dossiers/${dossier.id}/instances`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': dossier.project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            bookmarkInfo: {
                resetManipulation: reset,
            },
            persistViewState: 'true',
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    const dossierInstanceId = body.mid;
                    successLog(
                        `Resetting dossier/document for '${dossier.name}' with ID '${dossier.id}' is successful.`
                    );
                    resolve({ id: dossierInstanceId });
                } else {
                    if (body && body.code === 'ERR008' && retry) {
                        infoLog('Retrying Library Server API due to inbox msg not ready response.');
                        setTimeout(() => {
                            retry--;
                            resetManipulations({ baseUrl, session, dossier, reset }, retry).then(resolve, reject);
                        }, 1000);
                    } else {
                        errorLog(
                            `Resetting dossier/document for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                        );
                        reject(body.message);
                    }
                }
            } else {
                errorLog(
                    `Resetting dossier/document for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`
                );
                reject(error);
            }
        });
    });
}
