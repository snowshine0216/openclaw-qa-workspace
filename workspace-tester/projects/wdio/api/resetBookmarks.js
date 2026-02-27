import authentication from './authentication.js';
import createDossierInstance from './createDossierInstance.js';
import createReportInstance from './reports/createReportInstance.js';
import deleteBookmark from './deleteBookmark.js';
import getBookmarks from './getBookmarks.js';
import getShortcut from './getShortcut.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function resetBookmarks({ credentials, dossier, type = 'dossier' }) {
    groupLog('resetBookmarks by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let dossierInstance = {};
    if (type != 'report') {
        dossierInstance = await createDossierInstance({ baseUrl, session, dossier });
    } else {
        dossierInstance = await createReportInstance({ baseUrl, session, dossier });
    }
    const shortcut = await getShortcut({ baseUrl, session, dossier, dossierInstance });
    const bookmarkArray = await getBookmarks({ baseUrl, session, shortcut });
    for (const bookmark of bookmarkArray) {
        await deleteBookmark({ baseUrl, session, bookmark, shortcut });
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
