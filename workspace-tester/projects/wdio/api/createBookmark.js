import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function createBookmark({ baseUrl, session, dossier, dossierInstance, name }) {
    const options = {
        url: baseUrl + `api/bookmarks`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': dossier.project.id,
        },
        json: {
            instanceId: dossierInstance.id,
            name,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    successLog(
                        `Creating bookmark '${name}' with ID '${dossierInstance.id}' is successful.    id = '${body.id}'`
                    );
                    //resolve(body);
                    setTimeout(() => {
                        resolve(body);
                    }, 2000);
                } else {
                    errorLog(
                        `Creating bookmark '${name}' with ID '${dossierInstance.id}' failed. Status code: ${
                            response.statusCode
                        }. Message: ${JSON.stringify(body)}`
                    );
                    reject(body);
                }
            } else {
                errorLog(
                    `Creating bookmark '${name}' with ID '${dossierInstance.id}' failed. Error: ${JSON.stringify(
                        error
                    )}`
                );
                reject(error);
            }
        });
    });
}
