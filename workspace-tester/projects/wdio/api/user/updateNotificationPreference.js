import authentication from '../authentication.js';
import logout from '../logout.js';
import setUserPreference from '../setUserPreference.js';
import urlParser from '../urlParser.js';

/**
 * @param {Object} credentials - username & password
 * @param {boolean} value - preference's value
 */
export default async function updateNotificationPreference({ credentials, value = true }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await setUserPreference({ baseUrl, session, credentials, preference: 'showPersistentNotifications', value: value });
    await logout({ baseUrl, session });
}
