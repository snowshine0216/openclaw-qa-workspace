import authentication from './authentication.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

import getUserLibrary from './getUserLibrary.js';
import removeDossier from './removeDossier.js';
import deleteDossier from './deleteDossier.js';

// Share a dossier to the target users
// - nameRegex: if provided, remove dossiers whose names match the regex pattern
export default async function removeDossierFromUserLibraryHome({
    credentials,
    dossier,
    flag = true,
    nameRegex = null,
}) {
    groupLog('removeDossier by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    let session = await authentication({ baseUrl, authMode: 1, credentials });
    // get target user library shortcutlist
    const shortcutList = await getUserLibrary({ baseUrl, session });
    // if the dossier exists in the target user library, remove it
    for (const shortcutItem of shortcutList.documentContents) {
        if (nameRegex) {
            if (shortcutItem.name.match(nameRegex)) {
                const dossierToRemove = {
                    id: shortcutItem.target.id,
                    name: shortcutItem.name,
                    project: {
                        id: shortcutItem.projectId,
                    },
                };
                const shortcutToRemove = {
                    id: shortcutItem.id,
                    name: shortcutItem.name,
                };
                groupLog(`Removing the dossier '${dossierToRemove.name}' from '${credentials.username}' user library`);
                await deleteDossier({ baseUrl, session, dossier: dossierToRemove, shortcut: shortcutToRemove });
            }
            // Find next matching object
            continue;
        }
        if (shortcutItem.name === dossier.name) {
            groupLog(`Removing the dossier '${dossier.name}' from '${credentials.username}' user library`);
            await removeDossier({
                credentials,
                dossier,
            });
        }
    }
    // remove report from user library
    if (!flag) {
        groupLog(`Removing the report '${dossier.name}' from '${credentials.username}' user library`);
        for (const reportItem of shortcutList.reportContents) {
            if (reportItem.name === dossier.name) {
                groupLog(`Removing the report '${dossier.name}' from '${credentials.username}' user library`);
                await removeDossier({
                    credentials,
                    dossier,
                    flag: false,
                });
            }
        }
    }
    groupLogEnd();
}
