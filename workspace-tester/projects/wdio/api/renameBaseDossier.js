import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

// Remove a dossier
export default async function renameBaseDossier({ baseUrl, session, dossier, name }) {
    const projectId = dossier.project.id;
    const options = {
        url: baseUrl + `api/objects/${dossier.id}?type=55`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': projectId,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            name: name,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode == 200) {
                    successLog(`Rename the dossier '${dossier.name}' is successful`);
                    resolve();
                } else {
                    errorLog(`Rename the dossier '${dossier.name}' failed. status code: ${response.statusCode}`);
                    errorLog(`Renname the dossier '${dossier.name}' failed. message: ${body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Rename the dossier '${dossier.name}' failed.`);
                reject(error);
            }
        });
    });
}
