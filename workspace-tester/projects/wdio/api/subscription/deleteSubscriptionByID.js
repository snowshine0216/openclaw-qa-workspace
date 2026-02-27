import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';

export default async function deleteSubscription({ baseUrl, session, dossier, subscriptionId }) {
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
                        `Deleting subscription for '${subscriptionId}' is successful. Subscription ID: ${subscriptionId}`
                    );
                    resolve(body);
                } else {
                    errorLog(
                        `Deleting subscription for '${subscriptionId}' failed. Status code: ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Deleting subscription for '${subscriptionId}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
