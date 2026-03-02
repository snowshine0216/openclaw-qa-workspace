import authentication from './authentication.js';
import getUserLibrary from './getUserLibrary.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function refreshUserLibrary({ credentials }) {
    groupLog();
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials: credentials });
    await getUserLibrary({ baseUrl, session });
    await logout({ baseUrl, session });
    groupLogEnd();
}
