import request from 'request';
import urlParser from '../urlParser.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../config/consoleFormat.js';

export default async function setObjectExtendedProperties({ credentials, object, objectExtPropsPayload }) {
    groupLog('setObjectExtendedProperties by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await updateObjectExtendedProperties({ baseUrl, session, object, objectExtPropsPayload });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function updateObjectExtendedProperties({ baseUrl, session, object, objectExtPropsPayload }) {
    const options = {
        url: baseUrl + `api/objects/${object.id}/type/${object.type}/propertySets`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': object.project.id,
        },
        json: objectExtPropsPayload,
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(
                        `Update Object Extended Properties for '${object.name}' with ID '${object.id}' is successful.`
                    );
                    resolve();
                } else {
                    errorLog(
                        `Update Object Extended Properties for '${object.name}' with ID '${object.id}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(
                    `Update Object Extended Properties for '${object.name}' with ID '${object.id}' failed. Error: ${error}`
                );
                reject(error);
            }
        });
    });
}
