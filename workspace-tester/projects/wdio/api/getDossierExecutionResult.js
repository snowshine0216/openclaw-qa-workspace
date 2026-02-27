import request from 'request';
import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { errorLog, successLog, groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function getExecutionResult({ credentials, dossier, json }) {
    groupLog('Get execution result by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const result = await getDossierExecutionResult({ baseUrl, session, dossier, json });
    await logout({ baseUrl, session });
    groupLogEnd();
    return result;
}

async function getDossierExecutionResult({ baseUrl, session, dossier, json={} }) {
    const options = {
        url:
            baseUrl +
            `api/dossiers/${dossier.id}/executionResult`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': dossier.project.id,
        },
        json,
        encoding: null
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 202) {
                    successLog(`Get dossier execution result for '${dossier.name}' with ID '${dossier.id}' is successful.`);
                    resolve(body);
                } else {
                    errorLog(
                        `Get dossier execution result for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body.toString()}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Get dossier execution result for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
