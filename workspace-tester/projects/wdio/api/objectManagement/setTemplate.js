import request from 'request';
import urlParser from '../urlParser.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../config/consoleFormat.js';

/**
 * Set or unset an object as a template
 * @param {Object} params - Parameters for setting template status
 * @param {Object} params.credentials - Authentication credentials
 * @param {Object} params.object - Object information
 * @param {string} params.object.id - Object ID
 * @param {string} params.object.type - Object type (defaults to 55 if not provided)
 * @param {string} params.object.project.id - Project ID
 * @param {boolean} params.isTemplate - Whether to set (true) or unset (false) as template
 * @returns {Promise} - Promise resolving when complete
 */
export default async function setTemplate({ credentials, object, isTemplate = true }) {
    groupLog('setTemplate by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await updateTemplateStatus({ baseUrl, session, object, isTemplate });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function updateTemplateStatus({ baseUrl, session, object, isTemplate }) {
    const objectType = object.type || 55; // Default to 55 if not provided

    const options = {
        url: baseUrl + `api/objects/${object.id}?type=${objectType}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': object.project.id,
        },
        json: { template: isTemplate },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const action = isTemplate ? 'Set' : 'Unset';
                    successLog(`${action} object '${object.id}' as template is successful.`);
                    resolve();
                } else {
                    errorLog(
                        `Failed to ${isTemplate ? 'set' : 'unset'} object '${object.id}' as template. Status code: ${
                            response.statusCode
                        }. Message: ${JSON.stringify(body)}`
                    );
                    reject(body);
                }
            } else {
                errorLog(
                    `Failed to ${isTemplate ? 'set' : 'unset'} object '${object.id}' as template. Error: ${error}`
                );
                reject(error);
            }
        });
    });
}
