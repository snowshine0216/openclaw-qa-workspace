import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

// Remove a dossier
export default async function deleteDossier({ baseUrl, session, dossier, shortcut }) {
    const projectId = dossier.project.id;
    const shortcutId = shortcut.id;
    const name = dossier.name;
    const options = {
        url: baseUrl + 'api/dossierPersonalView',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': projectId,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            id: shortcutId,
            name,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode == 200) {
                    successLog(`Remove the dossier '${dossier.name}' is successful`);
                    resolve();
                } else {
                    errorLog(`Remove the dossier '${dossier.name}' failed. status code: ${response.statusCode}`);
                    errorLog(`Remove the dossier '${dossier.name}' failed. message: ${body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Remove the dossier '${dossier.name}' failed.`);
                reject(error);
            }
        });
    });
}
