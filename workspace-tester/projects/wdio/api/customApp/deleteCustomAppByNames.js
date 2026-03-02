import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { getCustomAppsAPI } from './getCustomApps.js';
import { deleteCustomAppAPI } from './deleteCustomApp.js';
import { groupLog, groupLogEnd, infoLog } from '../../config/consoleFormat.js';

// Delete content groups with specified name, and its owner should map to the specified credentials
export default async function deleteCustomAppByNames({ credentials, namesToFind, exactMatch = true }) {
    groupLog('deleteCustomAppByNames by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let customapps = await getCustomAppsAPI({ baseUrl, session });

    const names = namesToFind || [];
    let deleted = false;
    for (const cp of customapps) {
        const { id: customAppId, name } = cp;
        const found = names.some((n) => exactMatch ? n === name : name.includes(n));
        if (found) {
            await deleteCustomAppAPI({ baseUrl, session, customAppId });
            infoLog(`Deleted CustomApp '${name}' ${customAppId}`);
            deleted = true;
        }
    }
    if (!deleted) {
        infoLog(`No CustomApp was found to have name '${namesToFind}'`);
    }

    await logout({ baseUrl, session });
    groupLogEnd();
}
