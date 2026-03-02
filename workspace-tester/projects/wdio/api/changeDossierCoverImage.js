import authentication from './authentication.js';
import changeCoverImage from './changeCoverImage.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function changeDossierCoverImage({ credentials, dossier, imageUrl, type = 'Dossier' }) {
    groupLog('change dossier cover image by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });

    await changeCoverImage({ baseUrl, session, dossier, imageUrl, type });
    await logout({ baseUrl, session });
    groupLogEnd();
}
