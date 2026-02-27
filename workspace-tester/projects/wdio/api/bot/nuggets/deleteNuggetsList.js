import deleteNuggetsRestAPI from './deleteNuggetsRestAPI.js';
import urlParser from './../../urlParser.js';
import authentication from './../../authentication.js';
import { groupLog, groupLogEnd } from './../../../config/consoleFormat.js';
import logout from './../../logout.js';


export default async function deleteNuggetsList({ credentials, idList }) {
    groupLog('delete nugget by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    for (const nuggetId of idList) {
        if (nuggetId) {
            await deleteNuggetsRestAPI({ baseUrl, session, id: nuggetId });
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}