import authentication from './authentication.js';
import createDossierInstance from './createDossierInstance.js';
import createReportInstance from './reports/createReportInstance.js';
import deleteBookmark from './deleteBookmark.js';
import getBookmarks from './getBookmarks.js';
import getDossierData from './getDossierData.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import answerPrompt from './answerPrompt.js';

export default async function resetBookmarksWithPrompt({ credentials, dossier, type = 'dossier' }) {
    groupLog('resetBookmarksWithPrompt by api');
    let dossierInstance = {};
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    if (type != 'report') {
        dossierInstance = await createDossierInstance({ baseUrl, session, dossier });
    } else {
        dossierInstance = await createReportInstance({ baseUrl, session, dossier });
    }
    await answerPrompt({ baseUrl, session, dossier, dossierInstance });
    const data = await getDossierData({
        baseUrl,
        session,
        dossier,
        dossierInstance,
        includeTOC: true,
        includeShortcutInfo: true,
        resultFlag: 1,
        checkPrompted: false,
    });
    if (data.shortcut) {
        const shortcut = { id: data.shortcut.id, project: { id: dossier.project.id } };
        const bookmarkArray = await getBookmarks({ baseUrl, session, shortcut });
        for (const bookmark of bookmarkArray) {
            await deleteBookmark({ baseUrl, session, bookmark, shortcut });
        }
    } else {
        console.error(`No shortcut found for ${dossier.name} for user ${credentials.username}`);
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
