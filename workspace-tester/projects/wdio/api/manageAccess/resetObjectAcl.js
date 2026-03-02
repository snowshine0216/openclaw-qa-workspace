import getObjectAcl from './getObjectAcl.js';
import updateObjectAcl from './updateObjectAcl.js';
import { createACLRequestPayload } from './setObjectAcl.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import urlParser from '../urlParser.js';
import authentication from '../authentication.js';
import logout from '../logout.js';
import getSessionFromCurrentBrowser from '../../utils/getSessionFromCurrentBrowser.js';

/**
 *
 * @param credentials: { username, password }
 * @param object: { id, name, project, type }
 * @param acl: [{
                value: 'Full Control',
                id: 'C82C6B1011D2894CC0009D9F29718E4F',
                name: 'Everyone',
            },...], this parameter is optional if payload is provided
 * @param payload: { acl, applyToChildren, aclOverwrite }, this parameter is optional
 */
export default async function resetObjectAcl({ credentials, object, acl, payload }, isLogout = true) {
    groupLog('resetObjectAcl by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    let session = null;
    if (credentials) {
        session = await authentication({ baseUrl, authMode: 1, credentials });
    } else {
        session = await getSessionFromCurrentBrowser();
    }
    // get current acl
    const originalACL = await getObjectAcl({ baseUrl, session, object });
    // remove all current acl
    const resetACL = originalACL.map((ace) => {
        return {
            denied: ace.deny,
            inheritable: ace.inheritable,
            op: 'REMOVE',
            trustee: ace.trusteeId,
            type: ace.type,
        };
    });
    if (!acl) {
        acl = [];
    }
    // set the new acl
    if (!payload) {
        payload = { acl: acl };
    }
    const newACL = createACLRequestPayload(payload, object.type === 8);
    newACL.acl = resetACL.concat(newACL.acl);
    // update the acl
    await updateObjectAcl({ baseUrl, session, object, payload: newACL });

    if (isLogout) {
        await logout({ baseUrl, session });
    }
    groupLogEnd();
}
