import authentication from './authentication.js';
import createDossierInstance from './createDossierInstance.js';
import deleteBookmark from './deleteBookmark.js';
import getBookmarks from './getBookmarks.js';
import getShortcut from './getShortcut.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function deleteBookmarkByName({ credentials, dossier, name }) {
    groupLog('deleteBookmarkByName by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const dossierInstance = await createDossierInstance({ baseUrl, session, dossier });
    const shortcut = await getShortcut({ baseUrl, session, dossier, dossierInstance });
    const bookmarkArray = await getBookmarks({ baseUrl, session, shortcut });
    for (const bookmark of bookmarkArray) {
        if (bookmark.name === name) {
            await deleteBookmark({ baseUrl, session, bookmark, shortcut });
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
