import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';
import createBookmark from '../createBookmark.js';
import createDossierInstance from '../createDossierInstance.js';
import getAlertPayload from '../alert/alertPayload.js';

export default async function createAlert({ credentials, dossier, bookmarkName = 'alert', recipient }) {
    groupLog('Create alert via api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const dossierInstance = await createDossierInstance({ baseUrl, session, dossier });
    let response = await createBookmark({ baseUrl, session, dossier, dossierInstance, name: bookmarkName });
    let bookmarkId = response.id;
    let alertId = await sendAlertRequest({
        baseUrl,
        session,
        dossier,
        bookmarkId,
        credentials, 
        recipient: recipient,
    });
    await logout({ baseUrl, session });
    groupLogEnd('Finish create alert via api');
    return alertId;
}

async function sendAlertRequest({ baseUrl, session, dossier, bookmarkId, credentials, recipient }) {
    const alertInfo = await getAlertPayload({ bookmarkId: bookmarkId, credentials: credentials, recipient: recipient });
    const optionsForAlert = {
        url: baseUrl + `api/subscriptions`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': dossier.project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: alertInfo,
    };

    return new Promise((resolve, reject) => {
        request(optionsForAlert, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 201) {
                    const alertId = body.id;
                    successLog(
                        `Creating alert for '${dossier.name}' with ID '${dossier.id}' is successful. messageId: ${alertId}`
                    );
                    resolve(alertId);
                } else {
                    errorLog(
                        `Creating alert for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Creating alert for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
