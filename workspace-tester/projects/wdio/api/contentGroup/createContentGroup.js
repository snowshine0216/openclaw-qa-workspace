import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import createContentGroupWithoutContent from './createContentGroupWithoutContent.js';
import updateContent from './updateContent.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';

// create content group
export default async function createContentGroup(
    { credentials, contentGroupInfo, contentInfo },
    ifCreateContent = true
) {
    groupLog('createContentGroup by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    let contentGroupId = await createContentGroupWithoutContent({ baseUrl, session, contentGroupInfo });
    if (ifCreateContent === true) {
        try {
            await updateContent({ baseUrl, session, contentGroupId, contentInfo });
        } catch (error) {
            console.log('Fail to update content');
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
    return contentGroupId;
}
