import authentication from './authentication.js';
import getGroups from './getGroups.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import deleteGroup from './deleteGroup.js';

export default async function deleteAllGroups(credentials) {
    groupLog('deleteAllGroups by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const groups = await getGroups({ baseUrl, session });
    const groupIds = Object.keys(groups);
    if (groupIds.length > 1) {
        // exclude favorites
        for (const el of groupIds) {
            if (el !== 'FAVORITES') {
                await deleteGroup({ baseUrl: baseUrl, session: session, groupId: el });
            }
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
