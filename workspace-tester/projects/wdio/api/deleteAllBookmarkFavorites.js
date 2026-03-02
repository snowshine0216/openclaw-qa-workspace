import authentication from './authentication.js';
import getBookmarkFavorites from './getBookmarkFavorites.js';
import logout from './logout.js';
import urlParser from './urlParser.js';
import { groupLog, groupLogEnd } from '../config/consoleFormat.js';
import deleteBookmarkFavorites from './deleteBookmarkFavorites.js';

export default async function deleteAllBookmarkFavorites(credentials) {
    groupLog('deleteAllBookmarkFavorites by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const favoritesArray = await getBookmarkFavorites({ baseUrl, session });
    const bookmarkFavoritesArray = favoritesArray['itemKeys'];
    if (bookmarkFavoritesArray.length > 0) {
        await deleteBookmarkFavorites({ baseUrl: baseUrl, session: session, values: bookmarkFavoritesArray });
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
