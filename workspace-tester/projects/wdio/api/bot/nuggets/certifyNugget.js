import request from 'request';
import urlParser from './../../urlParser.js';
import authentication from './../../authentication.js';
import { successLog, errorLog } from '../../../config/consoleFormat.js';

export default async function certifyNugget({ nuggetId, credentials, type = '90', certify = true }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const options = {
        url: baseUrl + `api/objects/${nuggetId}/certify?type=${type}&certify=${certify}`,
        method: 'PUT',
        headers: {
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(`Certify/Decertify nugget '${nuggetId}' is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Certify/Decertify nugget '${nuggetId}' failed. Status code: ${response.statusCode}. Message: ${body.message}. SubMessage: ${body.subErrors.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Certify/Decertify nugget '${nuggetId}' failed.`);
                reject(error);
            }
        });
    });
}