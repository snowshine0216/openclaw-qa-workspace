import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import getDataModelFavorites from './getDataModelFavorites.js';
import deleteDataModelFavorites from './deleteDataModelFavorites.js';

export default async function deleteAllDataModelFavorites(credentials) {
    groupLog('deleteAllDataModelFavorites by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const groupArray = await getDataModelFavorites({ baseUrl, session });
    const favoritesArray = groupArray['itemKeys'];
    if (favoritesArray.length > 0) {
        await deleteDataModelFavorites({ baseUrl: baseUrl, session: session, values: favoritesArray });
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
