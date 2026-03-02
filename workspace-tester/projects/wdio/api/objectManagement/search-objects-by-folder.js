import request from 'request';
import authentication from '../authentication.js';
import logout from '../logout.js';
import urlParser from '../urlParser.js';
import { errorLog, successLog, groupLog, groupLogEnd } from '../../config/consoleFormat.js';
import * as reportConstants from '../../constants/report.js';

export const tmpFolderId = '32157318B1489278BC4B4AAAC8852BCB'; // MicroStrategy Tutorial > Public Objects > Reports > tmp > report_template

export default async function searchObjectsByFolder({
    credentials,
    projectId = reportConstants.tutorialProject.id,
    folderId = tmpFolderId,
    type = 55,
}) {
    groupLog('searchObjectsByFolder by api');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const objectList = await searchObjectsUnderFolder({ baseUrl, session, folderId, projectId, type });
    await logout({ baseUrl, session });
    groupLogEnd();
    return objectList;
}

export async function searchObjectIdsByNameByFolder({
    credentials,
    projectId = reportConstants.tutorialProject.id,
    folderId = tmpFolderId,
    type = 55,
    matchCriteria,
}) {
    groupLog('searchObjectIdsByNameByFolder by api');
    const res = await searchObjectsByFolder({ credentials, projectId, folderId, type });
    const result = res.filter((obj) => matchCriteria(obj)).map((obj) => obj.id);
    groupLogEnd();
    return result;
}

export async function searchObjectsUnderFolder({ baseUrl, session, folderId, projectId, type }) {
    const options = {
        url: baseUrl + `api/folders/${folderId}?type=${type}&excludedTypes=779&hidden=false`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Cookie: session.cookie,
            'x-mstr-projectid': projectId,
            'X-MSTR-AuthToken': session.token,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const objects = JSON.parse(body);
                    successLog(`Search objects under folder ${projectId} is successful.`);
                    resolve(objects);
                } else {
                    errorLog(
                        `Failed to search objects. Status code: ${response.statusCode}. Message: ${JSON.parse(body).message}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Failed to search objects. Error: ${error}`);
                reject(error);
            }
        });
    });
}
