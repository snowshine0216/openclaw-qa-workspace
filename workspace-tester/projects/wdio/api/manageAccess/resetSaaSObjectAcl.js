import getObjectAcl from './getObjectAcl.js';
import updateObjectAcl from './updateObjectAcl.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import urlParser from '../urlParser.js';
import getUserId from '../getUserId.js';
import getSessionFromCurrentBrowser from '../../utils/getSessionFromCurrentBrowser.js';

/**
 *
 * @param ownerId : object owner user id
 * @param object: { id, name, project, type }
 */
export default async function resetSaaSObjectAcl({ object }) {
    groupLog('resetSaaSObjectAcl by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await getSessionFromCurrentBrowser();
    // get current user id
    const userId = await getUserId({ baseUrl, session });
    // get current acl
    const originalACL = await getObjectAcl({ baseUrl, session, object });
    // remove all current acl if trustee is not owner
    let resetACL = [];
    for (let i in originalACL) {
        const ace = originalACL[i];
        if (ace.trusteeId != userId) {
            resetACL.push({
                denied: ace.deny,
                inheritable: ace.inheritable,
                op: 'REMOVE',
                trustee: ace.trusteeId,
                type: ace.type,
            });
        }
    }
    if (resetACL.length != 0) {
        const newACL = { acl: resetACL };
        // update the acl
        await updateObjectAcl({ baseUrl, session, object, payload: newACL });
    }
    groupLogEnd();
}
