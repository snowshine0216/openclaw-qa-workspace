import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import getSubscriptionsByUser from './getSubscriptionsByUser.js';
import deleteSubscriptionByID from './deleteSubscriptionByID.js';


export default async function deleteObjectsByFolder({ credentials, dossier }) {
    groupLog('deleteObjectByFolder by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const projectId = dossier.project.id;
    const subscriptions = await getSubscriptionsByUser({ baseUrl, session, projectId });
    //console.log(subscriptions.subscriptions);
    for (const subscription of subscriptions.subscriptions) {
        await deleteSubscriptionByID({ baseUrl, session, dossier, subscriptionId: subscription.id});
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
