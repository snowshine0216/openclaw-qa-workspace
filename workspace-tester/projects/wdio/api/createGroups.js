import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import createGroup from './createGroup.js';
import getGroups from './getGroups.js';

// create groups
export default async function createGroups({ groupList, credentials }) {
    groupLog('createGroups by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    for (const group of groupList) {
        await createGroup({ baseUrl, session, name: group.name, color: group.color.toLowerCase() });
        // await getGroups({baseUrl,session});
    }

    await logout({ baseUrl, session });
    groupLogEnd();
}
