import authentication from './authentication.js';
import renameBaseDossier from './renameBaseDossier.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import getDossierData from './getDossierData.js';
import createDossierInstance from './createDossierInstance.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function renameDossier({ credentials, dossier, name }) {
    groupLog('rename dossier by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const dossierInstance = await createDossierInstance({ baseUrl, session, dossier });
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
    groupLog('want to rename dossier: ' + data.n + ' to ' + name);
    if (data.n !== name) {
        await renameBaseDossier({ baseUrl, session, dossier, name });
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
