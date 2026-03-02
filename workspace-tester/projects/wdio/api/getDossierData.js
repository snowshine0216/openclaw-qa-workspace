import request from 'request';
import { errorLog, successLog } from '../config/consoleFormat.js';

export default async function getDossierData({
    baseUrl,
    session,
    dossier,
    dossierInstance,
    includeTOC = true,
    includeShortcutInfo = true,
    resultFlag = 3,
    checkPrompted = true,
}) {
    const options = {
        url:
            baseUrl +
            `api/dossiers/${dossier.id}/instances/${dossierInstance.id}?includeTOC=${includeTOC}&includeShortcutInfo=${includeShortcutInfo}&resultFlag=${resultFlag}&checkPrompted=${checkPrompted}`,
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
                    successLog(`Get dossier data for '${dossier.name}' with ID '${dossier.id}' is successful.`);
                    resolve(JSON.parse(body));
                } else {
                    errorLog(
                        `Get dossier data for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Get dossier data for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
