import authentication from './authentication.js';
import logout from './logout.js';
import deleteDossier from './deleteDossier.js';
import urlParser from './urlParser.js';
import createDossierInstance from './createDossierInstance.js';
import getShortcut from './getShortcut.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import createReportInstance from '././reports/createReportInstance.js';
import getDossierData from './getDossierData.js';
import answerPrompt from './answerPrompt.js';
import getSessionFromCurrentBrowser from '../utils/getSessionFromCurrentBrowser.js';

// Share a dossier to the target users
export default async function removeDossier({ credentials, dossier, flag = true, isLogout = true }) {
    groupLog('removeDossier by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    let session = null;
    if (credentials) {
        session = await authentication({ baseUrl, authMode: 1, credentials });
    } else {
        session = await getSessionFromCurrentBrowser();
    }
    let dossierInstance;
    if (!flag) {
        console.log('create report instance');
        dossierInstance = await createReportInstance({ baseUrl, session, dossier });
    } else {
        dossierInstance = await createDossierInstance({ baseUrl, session, dossier });
    }
    const data = await getDossierData({
        baseUrl,
        session,
        dossier,
        dossierInstance,
        includeTOC: true,
        includeShortcutInfo: true,
        resultFlag: 1,
        checkPrompted: true,
    });
    if (data.status === 2) {
        await answerPrompt({ baseUrl, session, dossier, dossierInstance });
        await browser.pause(2000);
    }
    const shortcut = await getShortcut({ baseUrl, session, dossier, dossierInstance });
    // delete shortcut
    await deleteDossier({ baseUrl, session, dossier, shortcut });
    if (isLogout) {
        await logout({ baseUrl, session });
    }
    groupLogEnd();
}
