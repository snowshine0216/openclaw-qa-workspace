import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function createDossierInstance({ baseUrl, session, dossier }) {
    const options = {
        url: baseUrl + `api/dossiers/${dossier.id}/instances`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': dossier.project.id,
        },
        json: {
            persistViewState: true,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    const dossierInstanceId = body.mid;
                    successLog(
                        `Creating dossier instance for '${dossier.name}' with ID '${dossier.id}' is successful. Dossier instance ID: ${dossierInstanceId}`
                    );
                    resolve({ id: dossierInstanceId });
                } else {
                    errorLog(
                        `Creating dossier instance for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(
                    `Creating dossier instance for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`
                );
                reject(error);
            }
        });
    });
}
