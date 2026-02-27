import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

// Remove a dossier
export default async function changeCoverImage({ baseUrl, session, dossier, imageUrl, type = 'Dossier' }) {
    const projectId = dossier.project.id;
    const options = {
        // change url that if type = Report, type=3, otherwise type=55
        url: baseUrl + `api/objects/${dossier.id}?type=${type === 'Report' ? 3 : 55}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': projectId,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            iconPath: imageUrl,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode == 200) {
                    successLog(`Change the cover image of the dossier '${dossier.name}' is successful`);
                    resolve();
                } else {
                    errorLog(`Change the cover image of the dossier '${dossier.name}' failed. status code: ${response.statusCode}`);
                    errorLog(`Change the cover image of the dossier '${dossier.name}' failed. message: ${body}`);
                    reject(body.message);
                }
            } else {
                errorLog(`Change the cover image of the dossier '${dossier.name}' failed.`);
                reject(error);
            }
        });
    });
}
