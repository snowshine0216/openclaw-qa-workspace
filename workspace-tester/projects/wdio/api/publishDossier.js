import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

// Publish or unpublish a dossier
export default async function publishDossier({ baseUrl, session, dossier, targetUserIds, isUnpublish = false }) {
    const dossierId = dossier.id;
    const projectId = dossier.project.id;
    const action = isUnpublish ? 'UNPUBLISH' : 'PUBLISH';
    const options = {
        url: baseUrl + 'api/dossierPersonalView',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': projectId,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            publishedToUsers: targetUserIds,
            srcId: dossierId,
            publishAction: action,
            isInstance: false,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            const actionText = action.toLowerCase() + 'ing';
            if (!error) {
                if (response.statusCode == 200) {
                    successLog(
                        `${actionText} the dossier '${dossier.name}' from '${targetUserIds.toString()}' is successful`
                    );
                    resolve();
                } else {
                    errorLog(`${actionText} the dossier '${dossier.name}' failed. status code: ${response.statusCode}`);
                    errorLog(`${actionText} the dossier '${dossier.name}' failed. message: ${body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`${actionText} the dossier '${dossier.name}' failed.`);
                reject(error);
            }
        });
    });
}
