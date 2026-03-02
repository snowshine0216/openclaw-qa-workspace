import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import updateContentGroupWithoutContent from './updateContentGroupWithoutContent.js';
import updateContent from './updateContent.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';

// update content group
export default async function updateContentGroup(
    { credentials, contentGroupId, updateContentGroupInfo, contentInfo },
    ifUpdateContent = false
) {
    groupLog('updateContentGroup by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await updateContentGroupWithoutContent({ baseUrl, session, contentGroupId, updateContentGroupInfo });
    if (ifUpdateContent === true) {
        await updateContent({ baseUrl, session, contentGroupId, contentInfo });
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
