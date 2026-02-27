import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';
import deleteBookmarkByName from '../deleteBookmarkByName.js';

export default async function deleteSubscriptions({ credentials, dossier, bookmarkName, subscriptionIds }) {
    groupLog('delete subscription by api');
    // first delete bookmarkIds
    const baseUrl = urlParser(browser.options.baseUrl);
    if (bookmarkName) {
        await deleteBookmarkByName({ credentials, dossier, name: bookmarkName });
    }
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    for (let i = 0; i < subscriptionIds.length; i++) {
        await deleteSubscription({
            baseUrl,
            session,
            dossier,
            subscriptionId: subscriptionIds[i],
        });
    }

    await logout({ baseUrl, session });
    groupLogEnd('end deleting subscription by api');
}

async function deleteSubscription({ baseUrl, session, dossier, subscriptionId }) {
    const optionsForSubscription = {
        url: baseUrl + `api/subscriptions/${subscriptionId}`,
        method: 'DELETE',
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
                if (response.statusCode === 204) {
                    successLog(
                        `Deleting subscription for '${dossier.name}' with ID '${dossier.id}' is successful. Subscription ID: ${subscriptionId}`
                    );
                    resolve(body);
                } else {
                    errorLog(
                        `Deleting subscription for '${dossier.name}' with ID '${dossier.id}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Deleting subscription for '${dossier.name}' with ID '${dossier.id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
