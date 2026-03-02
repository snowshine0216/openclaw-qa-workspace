import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function getShortcut({ baseUrl, session, dossier, dossierInstance }) {
    const options = {
        url: baseUrl + `api/documents/${dossier.id}/instances/${dossierInstance.id}/shortcut`,
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
                    const shortcutId = JSON.parse(body).id;
                    successLog(
                        `Getting shortcut ID for '${dossier.name}' with ID '${dossier.id}' is successful. Shortcut ID: ${shortcutId}`
                    );
                    resolve({
                        id: shortcutId,
                        project: {
                            id: dossier.project.id,
                        },
                    });
                } else {
                    errorLog(
                        `Getting shortcut ID for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Getting shortcut ID for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
