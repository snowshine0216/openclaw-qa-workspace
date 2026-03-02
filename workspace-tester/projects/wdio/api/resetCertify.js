import request from 'request';
import urlParser from './urlParser.js';
import authentication from './authentication.js';
import { errorLog, successLog, groupLog, groupLogEnd } from '../config/consoleFormat.js';
import logout from './logout.js';

/**
 * @param {Object} credentials - username & passowrd
 * @param {type} value - type value
 * This function can be used to certify/decertify
 * type=55 Specifies a DSS type of Document Definition, an document built from reports and HTML text.
 * type=3 Specifies a DSS type of Report Definition, describing a report that can be executed.
 * certify=true/false is equivalent to 'certify/decertify'
 */
export default async function resetCertify({ dossier, credentials, type, certify }) {
    groupLog('resetCertify by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await certifyDossier({ dossier, credentials, type, certify });
    await logout({ baseUrl, session });
    groupLogEnd();
}

// async function certifyDossier({ baseUrl, dossier, session, credentials, type }) {
async function certifyDossier({ dossier, credentials, type, certify }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const options = {
        url: baseUrl + `api/objects/${dossier.id}/certify?type=${type}&certify=${certify}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': dossier.project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Certify/Decertify dossier '${dossier.id}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Certify/Decertify dossier '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}. SubMessage: ${body.subErrors.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Certify/Decertify dossier '${dossier.id}' failed.`);
                reject(error);
            }
        });
    });
}
