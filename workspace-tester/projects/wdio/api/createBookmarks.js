import authentication from './authentication.js';
import logout from './logout.js';
import createBookmark from './createBookmark.js';
import urlParser from './urlParser.js';
import createDossierInstance from './createDossierInstance.js';
import createReportInstance from './reports/createReportInstance.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

// create bookmarks
export default async function createBookmarks({ bookmarkList, credentials, dossier, type = 'dossier' }) {
    groupLog('createBookmarks by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let dossierInstance = {};
    if (type != 'report') {
        dossierInstance = await createDossierInstance({ baseUrl, session, dossier });
    } else {
        dossierInstance = await createReportInstance({ baseUrl, session, dossier });
    }
    for (const bookmark of bookmarkList) {
        await createBookmark({ baseUrl, session, dossier, dossierInstance, name: bookmark });
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
