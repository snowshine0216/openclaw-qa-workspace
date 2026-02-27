import request from 'request';
import { errorLog, groupLog, successLog, groupLogEnd } from '../config/consoleFormat.js';
import authentication from './authentication.js';
import logout from './logout.js';

export async function clientTelemetryConfiguration({ credentials, enableClientTelemetryForAll, projectID }) {
    groupLog('edit client telemetry configuration settings by api');
    const baseUrl = browser.options.baseUrl;
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await clientTelemetryConfigurationAPI({ baseUrl, session, enableClientTelemetryForAll, projectID });
    await logout({ baseUrl, session });
    groupLogEnd();
}

async function clientTelemetryConfigurationAPI({ baseUrl, session, enableClientTelemetryForAll, projectID }) {
    const options = {
        url: baseUrl + `api/mstrServices/library/telemetryProducer/settings`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectID,
        },
        json: {
            enableClientTelemetryForAll: enableClientTelemetryForAll,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(
                        `project '${projectID}' to set enableClientTelemetryForAll to '${enableClientTelemetryForAll}' successful`
                    );
                    resolve(response.statusCode);
                } else {
                    errorLog(
                        `project '${projectID}' to set enableClientTelemetryForAll to '${enableClientTelemetryForAll}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(response.statusCode);
                }
            } else {
                errorLog(`set ClientTelemetryForAll failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
