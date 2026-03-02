import authentication from './../authentication.js';
import urlParser from './../urlParser.js';
import getObjectListByFolder from './getObjectListByFolder.js';
import deleteObject from '../deleteObject.js';
import logout from './../logout.js';
import { groupLog, groupLogEnd } from '../../config/consoleFormat.js';

export default async function deleteObjectByName({ credentials, parentFolderId, name, projectId }) {
    groupLog('deleteFolderByName by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const objectList = await getObjectListByFolder({ baseUrl, session, parentFolderId, projectId });
    for (const object of objectList) {
        if (object.name === name) {
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
