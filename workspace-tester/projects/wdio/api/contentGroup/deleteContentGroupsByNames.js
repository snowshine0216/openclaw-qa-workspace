import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import getContentGroups from './getContentGroups.js';
import deleteContentGroup from './deleteContentGroup.js';
import { groupLog, groupLogEnd, infoLog } from '../../config/consoleFormat.js';

// Delete content groups with specified name, and its owner should map to the specified credentials
export default async function deleteContentGroupsByNames({ credentials, namesToFind, exactMatch = true  }) {
    groupLog('deleteContentGroupsByNames by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let { contentGroups } = await getContentGroups({ baseUrl, session });

    const names = namesToFind || [];
    let deleted = false;
    for (const cg of contentGroups) {
        const { id: contentGroupId, name, owner } = cg;
        if (owner.name !== credentials.username) {
            continue;
        }
        const found = names.some((n) => exactMatch ? n === name : name.includes(n));
        if (found) {
            await deleteContentGroup({ baseUrl, session, contentGroupId });
            infoLog(`Deleted Content Group '${name}' ${contentGroupId}`);
            deleted = true;
        }
    }
    if (!deleted) {
        infoLog(`No Content Group was found to have name '${namesToFind}'`);
    }

    await logout({ baseUrl, session });
    groupLogEnd();
}
