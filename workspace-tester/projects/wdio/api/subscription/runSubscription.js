import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';

export default async function runSubscriptions({ credentials, dossier, subscriptionId }) {
    groupLog('run subscription by api');
    // first delete bookmarkIds
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });

    await runSubscription({
        baseUrl,
        session,
        dossier,
        subscriptionId: subscriptionId,
    });

    await logout({ baseUrl, session });
    groupLogEnd('end run subscription by api');
}

async function runSubscription({ baseUrl, session, dossier, subscriptionId }) {
    const optionsForSubscription = {
        url: baseUrl + `api/v2/subscriptions/${subscriptionId}/send`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': dossier.project.id,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(optionsForSubscription, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 202) {
                    successLog(
                        `Triggering subscription for '${dossier.name}' with ID '${dossier.id}' is successful. Subscription ID: ${subscriptionId}`
                    );
                    resolve(body);
                } else {
                    errorLog(
                        `Triggering subscription for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(
                    `Triggering subscription for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`
                );
                reject(error);
            }
        });
    });
}
