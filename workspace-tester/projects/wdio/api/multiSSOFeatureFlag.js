import request from 'request';
import urlParser from './urlParser.js';
import authentication from './authentication.js';
import logout from './logout.js';
import { errorLog, successLog, groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function setFeatureFlag({ featureFlagId, status, credentials }) {
    groupLog('Set Feature Flag by API');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await updateFeatureFlag({ baseUrl, session, featureFlagId, status, credentials });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function updateFeatureFlag({ baseUrl, session, featureFlagId, status, credentials }) {
    const options = {
        url: `${baseUrl}api/configurations/featureFlags/${featureFlagId}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
        json: {
            status: status,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    successLog(
                        `Feature flag '${featureFlagId}' for the user '${credentials.username}' set to status: ${status} successfully.`
                    );
                    resolve();
                } else {
                    errorLog(
                        `Setting feature flag '${featureFlagId}' for the user '${credentials.username}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Setting feature flag '${featureFlagId}' for the user '${credentials.username}' failed.`);
                reject(error);
            }
        });
    });
}
