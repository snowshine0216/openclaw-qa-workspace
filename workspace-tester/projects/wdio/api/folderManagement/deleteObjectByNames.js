import authentication from './../authentication.js';
import logout from './../logout.js';
import urlParser from './../urlParser.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import getObjectListByFolder from './getObjectListByFolder.js';
import deleteObject from '../deleteObject.js';

export default async function deleteObjectByNames({ credentials, parentFolderId, names, projectId, subtype }) {
    groupLog('deleteObjectByNames by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const objectList = await getObjectListByFolder({ baseUrl, session, parentFolderId, projectId });
    for (const object of objectList) {
        if (names.includes(object.name) && (subtype === undefined || object.subtype === subtype)) {
            await deleteObject({
                baseUrl,
                session,
                object_id: object.id,
                type: object.type,
                projectId: projectId,
            });
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}
