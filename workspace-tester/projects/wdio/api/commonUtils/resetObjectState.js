import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';

/**
 * common util to help reset object state, for example Reset Dossier State or Reset Report State
 * @param {object} credentials
 * @param {object} dossier object info
 * @param {function} resetManipulations
 */
export default async function resetObjectState(credentials, dossier, resetManipulations) {
    groupLog('resetObjectState by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    let session;

    let retryAuth, retryReset, retryLogout;

    try {
        session = await authentication({ baseUrl, authMode: 1, credentials });
    } catch (err) {
        if (err.code === 'ECONNRESET' && !retryAuth) {
            retryAuth = true;
            session = await authentication({ baseUrl, authMode: 1, credentials });
        }
    }
    try {
        await resetManipulations({ baseUrl, session, dossier, reset: true });
    } catch (err) {
        if (err.code === 'ECONNRESET' && !retryReset) {
            retryReset = true;
            await resetManipulations({ baseUrl, session, dossier, reset: true });
        }
    }
    try {
        await logout({ baseUrl, session });
    } catch (err) {
        if (err.code === 'ECONNRESET' && !retryLogout) {
            retryLogout = true;
            await logout({ baseUrl, session });
        }
    }
    groupLogEnd();
}
