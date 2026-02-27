import request from 'request';
import authentication from './authentication.js';

export default async function getDossierErrorMessage({ baseUrl, credentials, projectId, docId }) {
    let message = null;

    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const options = {
        url: baseUrl + `api/dossiers/${docId}/instances`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
            Cookie: session.cookie,
        },
        json: {
            filters: null,
            persistViewState: true,
            resolveOnly: false,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                try {
                    if (response.statusCode === 500) {
                        message = response.body.message;
                        console.error(`Get Dossier Error Message Success. Status code: ${response.statusCode}.`);
                        resolve({ message });
                    } else {
                        console.error(`Get Dossier Error Message Failed. Status code: ${response.statusCode}.`);
                        reject(body);
                    }
                } catch (err) {
                    console.error(`Get Dossier Error Message Failed. Try & Catch Error: ${err}`);
                    reject(error);
                }
            } else {
                console.error(`Get Dossier Error Message Failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
