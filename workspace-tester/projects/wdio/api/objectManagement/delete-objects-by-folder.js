import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { searchObjectsUnderFolder, tmpFolderId } from './search-objects-by-folder.js';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import * as reportConstants from '../../constants/report.js';

export default async function deleteObjectsUnderFolder({
    credentials,
    folderId = tmpFolderId,
    type = 55,
    projectId = reportConstants.tutorialProject.id,
}) {
    groupLog('deleteObjectsUnderFolder by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const objectList = await searchObjectsUnderFolder({ baseUrl, session, folderId, projectId, type });
    for (const obj of objectList) {
        if (obj) {
            await deleteObjectAPI({ baseUrl, session, id: obj.id, projectId, type: obj.type, name: obj.name });
        }
    }
    await logout({ baseUrl, session });
    groupLogEnd();
}

export async function deleteObject({ credentials, id, projectId, type }) {
    groupLog('delete object by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    await deleteObjectAPI({ baseUrl, session, id, projectId, type });
    await logout({ baseUrl, session });
    groupLogEnd();
}

export async function deleteObjectAPI({ baseUrl, session, id, projectId, type = 55, name = '' }) {
    const options = {
        url: baseUrl + `api/objects/${id}?type=${type}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'X-MSTR-AuthToken': session.token,
            'X-MSTR-ProjectID': projectId,
        },
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 204) {
                    successLog(`delete object '${name}' successful. id = '${id}'`);
                    resolve();
                } else {
                    errorLog(`delete object failed. Status code: ${response.statusCode}. Message: ${response.body}`);
                    reject(body);
                }
            } else {
                errorLog(`delete object '${id}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
