import _ from 'lodash';
import authentication from './authentication.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import createDossierInstance from './createDossierInstance.js';
import getShortcut from './getShortcut.js';
import getBookmarks from './getBookmarks.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function generateSharedLink({ credentials, dossier }) {
    groupLog('generateSharedLink by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const dossierInstance = await createDossierInstance({ baseUrl, session, dossier });
    const shortcut = await getShortcut({ baseUrl, session, dossier, dossierInstance });
    const bookmarks = await getBookmarks({ baseUrl, session, shortcut });
    const projectId = dossier.project.id;
    const docId = dossier.id;

    await logout({ baseUrl, session });
    groupLogEnd();

    if (_.isEmpty(bookmarks)) {
        return baseUrl + ['app', projectId, docId, 'share'].join('/');
    } else {
        return baseUrl + ['app', projectId, docId, 'bookmarks'].join('/') + '?ids=' + _.map(bookmarks, 'id').join(',');
    }
}
