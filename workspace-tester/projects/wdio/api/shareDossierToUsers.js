import authentication from './authentication.js';
import logout from './logout.js';
import publishDossier from './publishDossier.js';
import refreshUserLibrary from './refreshUserLibrary.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import removeDossierFromUserLibraryHome from './removeDossierFromUserLibraryHome.js';


// Share a dossier to the target users
export default async function shareDossierToUsers({ credentials, dossier, targetUserIds, targetCredentialsList }) {
    groupLog();
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    // get user library shortcutlist 
    
    // delete shortcut firstly
    for (const targetCredentials of targetCredentialsList) {
        await removeDossierFromUserLibraryHome({
            credentials: targetCredentials,
            dossier: dossier,
        });
    }
    // Share the dossier to the target users
    await publishDossier({ baseUrl, session, dossier, targetUserIds, isUnpublish: false });

    groupLogEnd();
}
