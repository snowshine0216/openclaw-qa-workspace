import request from 'request';
import { errorLog, successLog } from '../../config/consoleFormat.js';

/*
This API is to get Bot's data
Paramaters: 
    iServerRest: environment address. e.g. http://mci-ze4yt-dev.hypernow.microstrategy.com:30037

    sessionID: get by createSeeionAPI. e.g. 18DEB5193C003BAFB6C1D1CCD50514DB

    basicInfo: basic project/login info
    const basicInfo = {
        data: {
            login: 'auto_ai_snapshot',
            password: '',
            applicationType: 6,
            projectId: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                
        },
    };

    botInfo: body data requested by this API. e.g.
    const botInfo = {
        data: {
            idtypes: [
                {
                    did: 'AF34717FF34F0B336F409E988AA4757A',
                    tp: 89,
                    pid: 'B7CA92F04B9FAE8D941C3E9B7E0CD754',
                },
            ],
        },
    };
*/
export default async function bulkReadObjectsAPI({ iServerRest, sessionID, basicInfo, botInfo }) {
    const options = {
        url: iServerRest + '/api/bulkreadobjects',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-MSTR-ISERVER-SESSION': sessionID,
            'X-MSTR-ISERVER-PROJECT-ID': basicInfo.data.projectId,
        },
        json: botInfo.data,
    };

    return new Promise((resolve, reject) => {
        //console.log(options);
        request(options, (error, response, body) => {
            if (!error) {
                if (response.statusCode === 200) {
                    const bot_data = body;
                    successLog('Get bot info successfully');
                    resolve(bot_data);
                } else {
                    errorLog(
                        `Fail to get data of bot '${JSON.stringify(botInfo)}'. Status code: 
                        ${response.statusCode}. Message: ${body.message}`
                    );
                    reject(body.message);
                }
            } else {
                errorLog(`Fail to get data of bot '${JSON.stringify(botInfo)}' failed. Error: ${error}`);
                reject(error);
            }
        });
    });
}
