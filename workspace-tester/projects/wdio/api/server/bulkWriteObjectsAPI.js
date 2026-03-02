import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

/*
This API is to reset Bot with provided bot data
Paramaters: 
    iServerRest: environment address. e.g. 10.23.35.208:34962

    sessionID: get by createSeeionAPI. e.g. 18DEB5193C003BAFB6C1D1CCD50514DB

    basicInfo: basic project/login info, e.g. 
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                
        },
    };

    botData: body data requested by this API, used for resetting bot, get by bulkReadObjectsAPI
             should make sure that 'vr' info is the latest
*   -------------------------------------------------------- 
*
*   1. make parameters of bulkWriteObjectsAPI to be more generic since thise api will be used in lots of cases, e.g. bot/nuggets
*   2. to avoid refactor all the exisiting usage, keep the old parameters and add new parameters and adding compaitibility for old usage
*
*/
export default async function bulkWriteObjectsAPI({ iServerRest, sessionID, basicInfo, botData, projectId, data }) {
    let headers = {
        'Content-Type': 'application/json',
        'X-MSTR-ISERVER-SESSION': sessionID,
    };
    let pid = projectId;
    if (!pid && basicInfo) {
        pid = basicInfo.data.projectId;
    }
    if (pid) {
        headers = { ...headers, 'X-MSTR-ISERVER-PROJECT-ID': pid };
    }
    const options = {
        url: iServerRest + '/api/bulkwriteobjects',
        method: 'POST',
        headers,
        json: data || botData.data,
    };

    return new Promise((resolve, reject) => {
        //console.log(options);
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    //const bot_data = body;
                    successLog('Call builk write against iServer Rest successfully.');
                    resolve(body.data);
                } else {
                    errorLog(
                        `Fail to call builk write against iServer Rest by data = '${JSON.stringify(data)}'. Status code:
                        ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(
                    `Fail to call builk write against iServer Rest by data = '${JSON.stringify(
                        data
                    )}' failed. Error: ${error}`
                );
                reject(error);
            }
        });
    });
}
