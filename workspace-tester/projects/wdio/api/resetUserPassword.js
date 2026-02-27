import urlParser from './urlParser.js';
import resetPassword from './resetPassword.js';
import authentication from './authentication.js';
import logout from './logout.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';

export default async function resetUserPassword({ credentials, userId, password = '', requireNewPassword = false }) {
    groupLog('resetUserPassword by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await resetPassword(baseUrl, session, userId, password, requireNewPassword);
    await logout({ baseUrl, session });
    groupLogEnd();
}
