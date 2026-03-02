import authentication from './authentication.js';
import logout from './logout.js';
import setUserPreference from './setUserPreference.js';
import urlParser from './urlParser.js';

/**
 * @param {Object} credentials - username & passowrd\
 * @param {int} value - preference's value
 * This function can be used to change user's onboarding tutorial setting
 * By default, it will set user preference 'showDossierLibraryWelcome' to value 0
 * which means user has already viewed all the onboarding tutorials.
 * Onboarding settings are saved as binary representation:
 * 1000 == 8 is equivalent to 'Library page tutorial'
 * 0100 == 4 is equivalent to 'Library App tutorial'
 * 0010 == 2 is equivalent to 'Dossier page tutorial'
 * 0001 == 1 is equivalent to 'Notification tutorial'
 */
export default async function resetOnboarding({ credentials, value }) {
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await setUserPreference({ baseUrl, session, credentials, preference: 'showDossierLibraryWelcome', value });
    await logout({ baseUrl, session });
}
