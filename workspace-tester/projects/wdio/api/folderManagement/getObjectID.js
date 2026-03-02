import authentication from './../authentication.js';
import urlParser from './../urlParser.js';
import getObjectListByFolder from './getObjectListByFolder.js';
import logout from './../logout.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';

export default async function getObjectID({ credentials, parentFolderId, name, projectId }) {
    groupLog('get object ID');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const objectList = await getObjectListByFolder({ baseUrl, session, parentFolderId, projectId });
    for (const object of objectList) {
        if (object.name === name) {
            return object.id;
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
