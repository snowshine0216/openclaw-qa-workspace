import authentication from './authentication.js';
import getGroups from './getGroups.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import deleteFavorites from './deleteFavorites.js';

export default async function deleteAllFavorites(credentials) {
    groupLog('deleteAllFavorites by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const groupArray = await getGroups({ baseUrl, session });
    const favoritesArray = groupArray['FAVORITES']['itemKeys'];
    if (favoritesArray.length > 0) {
        await deleteFavorites({ baseUrl: baseUrl, session: session, values: favoritesArray });
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
