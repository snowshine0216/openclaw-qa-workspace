import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import deleteContentGroup from './deleteContentGroup.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';

// delete content group
export default async function deleteContentGroupsByIds({ credentials, contentGroupIds }) {
    groupLog('deleteContentGroupsByIds by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    for (const contentGroupId of contentGroupIds) {
        await deleteContentGroup({ baseUrl, session, contentGroupId });
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
