import authentication from '../authentication.js';
import logout from '../logout.js';
import { groupLog, groupLogEnd, successLog, errorLog } from '../../config/consoleFormat.js';
import urlParser from '../urlParser.js';
import request from 'request';

export async function getSharedReportsFolderInfo({ credentials, projectId }) {
    return (await getPredefinedFolder({ credentials, folderType: 7, projectId }))[0];
}

export async function getMyReportsFolderInfo({ credentials, projectId }) {
    return (await getPredefinedFolder({ credentials, folderType: 20, projectId }))[0];
}

export async function getPredefinedFolder({ credentials, folderType, projectId }) {
    groupLog('get predefined folder');
    const baseUrl = urlParser(browser.options.baseUrl);
    const session = await authentication({ baseUrl, authMode: 1, credentials });
    const encodedFolderType = encodeURIComponent(folderType);
    const options = {
        url: `${baseUrl}api/folders/preDefined?folderType=${encodedFolderType}&showNavigationPath=true&includeAncestors=true`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ProjectID': projectId,
            'X-MSTR-AuthToken': session.token,
            Cookie: session.cookie,
        },
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const predefinedFolderResponse = JSON.parse(body);
                    const predefinedFolder = predefinedFolderResponse.preDefined;
                    successLog(`Getting predefined folder of type '${folderType}' is successful.`);
                    resolve(predefinedFolder);
                } else {
                    errorLog(
                        `Getting predefined folder of type '${folderType}' failed. Status code: ${response.statusCode}. Message: ${body}`
                    );
                    reject(body);
                }
            } else {
                errorLog(`Getting predefined folder of type '${folderType}' failed. Error: ${error}`);
                reject(error);
            }
        });
    })
        .catch((error) => {
            console.error('Error getting predefined folder:', error);
            throw error;
        })
        .finally(async () => {
            await logout({ baseUrl, session });
            groupLogEnd();
        });
}
